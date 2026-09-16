import struct
import json
import math
import numpy as np
from PIL import Image

# 1. Inspect Reference Side Silhouette
side_img = Image.open('/home/user/nyanopan-store/public/brand/ref_side_crop.png').convert('RGBA')
W_side, H_side = side_img.size
side_arr = np.array(side_img)

# Find true normalized profile along X (heel x=0 to toe x=W_side-1)
# In Three.js coordinate system:
# Z: from Heel (-1.4) to Toe (+1.4)
# Y: from Sole Bottom (-0.35) to Collar Peak (+0.55)
# X: from Medial (-0.6) to Lateral (+0.6)

# Sample side view profile at N_SLICES along Z:
N_SLICES = 48 # along length (Z axis)
N_RING = 32   # radial points around cross-section

slice_zs = np.linspace(-1.38, 1.42, N_SLICES)
# Extract side profile height and sole thickness from real photo
profile_top_y = []
profile_sole_y = []
profile_bot_y = []

for z in slice_zs:
    u = (z - (-1.38)) / (1.42 - (-1.38)) # 0.0 at heel, 1.0 at toe
    # Pixel x in side photo:
    px = int(np.clip(u * (W_side - 1), 0, W_side - 1))
    col = side_arr[:, px]
    non_black = np.where((col[:, 0] > 15) | (col[:, 1] > 15) | (col[:, 2] > 15))[0]
    if len(non_black) > 0:
        py_top = non_black[0]
        py_bot = non_black[-1]
        
        # detect sole line (warm crepe rubber vs neutral grey wool)
        found_sole = py_bot
        for y in reversed(non_black):
            r, g, b = col[y, 0], col[y, 1], col[y, 2]
            if (int(r) - int(b)) > 35:
                found_sole = y
            else:
                break
        
        # Normalize to 3D world units:
        # Base of shoe sits on ground Y = 0.0 (or -0.35)
        # Let bottom of sole be y = -0.32
        # Collar peak is at px ~ 45% (instep peak)
        total_h = H_side
        # In photo, y goes down from 0 to H_side
        # In 3D, bottom is -0.32, top is -0.32 + height_in_3d
        y_world_bot = -0.32
        # Toe spring: toe slightly curves up from floor in real shoe
        if u > 0.8:
            toe_lift = ((u - 0.8) / 0.2) ** 1.8 * 0.08
            y_world_bot += toe_lift
        elif u < 0.15:
            heel_lift = ((0.15 - u) / 0.15) ** 2.0 * 0.05
            y_world_bot += heel_lift
            
        pixel_h = max(10, py_bot - py_top)
        sole_pixel_h = max(5, py_bot - found_sole)
        
        # Scale to 3D: full shoe height ~ 0.85 units at peak instep
        # Map photo height (max ~ 450px) to world units
        scale_y = 0.82 / 460.0
        world_h = pixel_h * scale_y
        world_sole_h = max(0.12, min(0.20, sole_pixel_h * scale_y))
        
        profile_bot_y.append(y_world_bot)
        profile_sole_y.append(y_world_bot + world_sole_h)
        profile_top_y.append(y_world_bot + world_h)
    else:
        profile_bot_y.append(-0.32)
        profile_sole_y.append(-0.18)
        profile_top_y.append(0.2)

# Foot width profile from top-down reference:
# At heel: width is narrower (~0.46)
# At instep / ball of foot: widest (~0.62)
# At toe: rounded organic toe curve
def get_half_width(u):
    if u < 0.2: # heel
        t = u / 0.2
        return 0.20 + 0.18 * math.sin(t * math.pi * 0.5)
    elif u < 0.65: # arch to ball of foot
        t = (u - 0.2) / 0.45
        return 0.38 + 0.14 * math.sin(t * math.pi)
    else: # toe taper
        t = (u - 0.65) / 0.35
        return 0.52 * math.cos(t * math.pi * 0.46)

# Generate 3D Meshes:
# 1. Wool Upper Mesh (vertices, normals, uvs, indices)
# 2. Crepe Sole Mesh (vertices, normals, uvs, indices)
# 3. Ergonomic Footbed Mesh

# --- 1. Wool Upper Mesh ---
upper_verts = []
upper_normals = []
upper_uvs = []
upper_indices = []

# Collar opening parameters:
# Slipper ankle hole starts around u = 0.06 to u = 0.52
# On slices in that range, the top dome opens into the interior cavity with a rolled felt lip!

for i, z in enumerate(slice_zs):
    u = (z - (-1.38)) / (1.42 - (-1.38))
    bot_y = profile_sole_y[i] # sits directly on top of crepe sole
    top_y = profile_top_y[i]
    hw = get_half_width(u)
    
    # Asymmetry: inside foot (medial) is slightly straighter, lateral curves more
    medial_x = -hw * 0.94
    lateral_x = hw * 1.06
    
    is_collar_open = (0.05 < u < 0.52)
    
    for j in range(N_RING):
        theta = (j / N_RING) * 2 * math.pi
        sin_t = math.sin(theta)
        cos_t = math.cos(theta)
        
        # x position across foot:
        if cos_t < 0:
            x = cos_t * abs(medial_x)
        else:
            x = cos_t * lateral_x
            
        # y height:
        if is_collar_open and sin_t > 0.05:
            # Collar cavity: dips inward to create authentic rolled felt rim and ankle hole
            rim_height = bot_y + (top_y - bot_y) * 0.35
            # Outer rim:
            y = rim_height - (sin_t - 0.05) * 0.18
            # Pinch x inward towards ankle cavity
            x *= (1.0 - sin_t * 0.45)
        else:
            # Closed dome
            # sin_t goes from -1 (bottom on sole) to +1 (top ridge)
            v = 0.5 * (sin_t + 1.0) # 0 to 1
            # Organic rounded curvature:
            y = bot_y + (top_y - bot_y) * (math.sin(v * math.pi * 0.5) ** 0.85)
            
        # Normal approximation:
        nx = cos_t
        ny = max(0.1, sin_t)
        nz = (0.5 - u) * 0.4
        n_len = math.sqrt(nx*nx + ny*ny + nz*nz)
        
        upper_verts.extend([float(x), float(y), float(z)])
        upper_normals.extend([float(nx/n_len), float(ny/n_len), float(nz/n_len)])
        # UV mapping:
        upper_uvs.extend([float(j / N_RING), float(u)])

# Triangle indices for Upper:
for i in range(N_SLICES - 1):
    for j in range(N_RING):
        p1 = i * N_RING + j
        p2 = i * N_RING + (j + 1) % N_RING
        p3 = (i + 1) * N_RING + (j + 1) % N_RING
        p4 = (i + 1) * N_RING + j
        upper_indices.extend([p1, p2, p3, p1, p3, p4])

# Cap the heel (slice 0) and toe (slice N_SLICES-1)
heel_center_idx = len(upper_verts) // 3
upper_verts.extend([0.0, float(profile_sole_y[0] + 0.1), float(slice_zs[0])])
upper_normals.extend([0.0, 0.2, -1.0])
upper_uvs.extend([0.5, 0.0])

for j in range(N_RING):
    p1 = heel_center_idx
    p2 = j
    p3 = (j + 1) % N_RING
    upper_indices.extend([p1, p3, p2])

toe_center_idx = len(upper_verts) // 3
upper_verts.extend([0.0, float(profile_sole_y[-1] + 0.08), float(slice_zs[-1])])
upper_normals.extend([0.0, 0.2, 1.0])
upper_uvs.extend([0.5, 1.0])

last_ring_offset = (N_SLICES - 1) * N_RING
for j in range(N_RING):
    p1 = toe_center_idx
    p2 = last_ring_offset + j
    p3 = last_ring_offset + (j + 1) % N_RING
    upper_indices.extend([p1, p2, p3])

# --- 2. Crepe Sole Mesh ---
# The sole wraps around the bottom with a 3D perimeter sidewall bumper matching the crepe rubber in reference photos!
sole_verts = []
sole_normals = []
sole_uvs = []
sole_indices = []

for i, z in enumerate(slice_zs):
    u = (z - (-1.38)) / (1.42 - (-1.38))
    y_bot = profile_bot_y[i]
    y_top = profile_sole_y[i] + 0.02 # overlaps slightly into upper for seamless seam
    hw = get_half_width(u) * 1.03    # sole extends slightly beyond felt upper like in real shoe
    medial_x = -hw * 0.94
    lateral_x = hw * 1.06
    
    # Sidewall ring (around perimeter):
    # j = 0: left bottom, j = 1: left top, j = 2: right top, j = 3: right bottom
    pts = [
        (medial_x, y_bot, -0.9, -0.3),
        (medial_x, y_top, -0.9, 0.3),
        (lateral_x, y_top, 0.9, 0.3),
        (lateral_x, y_bot, 0.9, -0.3),
    ]
    for px, py, nx, ny in pts:
        sole_verts.extend([float(px), float(py), float(z)])
        sole_normals.extend([float(nx), float(ny), 0.0])
        sole_uvs.extend([float(0.5 + px * 0.5), float(u)])

for i in range(N_SLICES - 1):
    for j in range(4):
        p1 = i * 4 + j
        p2 = i * 4 + (j + 1) % 4
        p3 = (i + 1) * 4 + (j + 1) % 4
        p4 = (i + 1) * 4 + j
        sole_indices.extend([p1, p2, p3, p1, p3, p4])

# Sole Bottom Floor Plate (walking surface with traction):
bottom_start_idx = len(sole_verts) // 3
for i, z in enumerate(slice_zs):
    u = (z - (-1.38)) / (1.42 - (-1.38))
    y_bot = profile_bot_y[i]
    hw = get_half_width(u) * 1.03
    medial_x = -hw * 0.94
    lateral_x = hw * 1.06
    # Left and Right bottom points
    sole_verts.extend([float(medial_x), float(y_bot), float(z)])
    sole_normals.extend([0.0, -1.0, 0.0])
    sole_uvs.extend([0.15, float(u)])
    
    sole_verts.extend([float(lateral_x), float(y_bot), float(z)])
    sole_normals.extend([0.0, -1.0, 0.0])
    sole_uvs.extend([0.85, float(u)])

for i in range(N_SLICES - 1):
    p_bl1 = bottom_start_idx + i * 2
    p_br1 = bottom_start_idx + i * 2 + 1
    p_bl2 = bottom_start_idx + (i + 1) * 2
    p_br2 = bottom_start_idx + (i + 1) * 2 + 1
    sole_indices.extend([p_bl1, p_br1, p_br2, p_bl1, p_br2, p_bl2])

print(f"Upper: {len(upper_verts)//3} verts, {len(upper_indices)//3} tris.")
print(f"Sole: {len(sole_verts)//3} verts, {len(sole_indices)//3} tris.")

# Compile into Binary GLTF 2.0 with separate meshes for Upper and Crepe Sole
def pack_mesh_buffers(v, n, uv, ind):
    v_bytes = struct.pack(f'<{len(v)}f', *v)
    n_bytes = struct.pack(f'<{len(n)}f', *n)
    uv_bytes = struct.pack(f'<{len(uv)}f', *uv)
    ind_bytes = struct.pack(f'<{len(ind)}H', *ind)
    return v_bytes, n_bytes, uv_bytes, ind_bytes

u_vb, u_nb, u_uvb, u_ib = pack_mesh_buffers(upper_verts, upper_normals, upper_uvs, upper_indices)
s_vb, s_nb, s_uvb, s_ib = pack_mesh_buffers(sole_verts, sole_normals, sole_uvs, sole_indices)

# Assemble single combined buffer with 4-byte alignment
buffer_chunks = [u_vb, u_nb, u_uvb, u_ib, s_vb, s_nb, s_uvb, s_ib]
buffer_data = bytearray()
buffer_views = []

for b in buffer_chunks:
    pad = (4 - (len(buffer_data) % 4)) % 4
    buffer_data.extend(b'\x00' * pad)
    offset = len(buffer_data)
    buffer_data.extend(b)
    buffer_views.append({
        "buffer": 0,
        "byteOffset": offset,
        "byteLength": len(b)
    })

# Compute Bounding Boxes
def get_min_max_3(arr):
    xs = arr[0::3]
    ys = arr[1::3]
    zs = arr[2::3]
    return [min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)]

def get_min_max_2(arr):
    us = arr[0::2]
    vs = arr[1::2]
    return [min(us), min(vs)], [max(us), max(vs)]

u_vmin, u_vmax = get_min_max_3(upper_verts)
u_uvmin, u_uvmax = get_min_max_2(upper_uvs)
s_vmin, s_vmax = get_min_max_3(sole_verts)
s_uvmin, s_uvmax = get_min_max_2(sole_uvs)

gltf_dict = {
    "asset": {"version": "2.0", "generator": "NyanopanPrecision3D"},
    "scenes": [{"nodes": [0, 1]}],
    "nodes": [
        {"name": "WoolUpper", "mesh": 0},
        {"name": "CrepeSole", "mesh": 1}
    ],
    "materials": [
        {
            "name": "WoolFeltMaterial",
            "pbrMetallicRoughness": {
                "baseColorFactor": [0.82, 0.81, 0.79, 1.0],
                "roughnessFactor": 0.94,
                "metallicFactor": 0.02
            }
        },
        {
            "name": "CrepeRubberMaterial",
            "pbrMetallicRoughness": {
                "baseColorFactor": [0.89, 0.68, 0.38, 1.0],
                "roughnessFactor": 0.88,
                "metallicFactor": 0.05
            }
        }
    ],
    "meshes": [
        {
            "name": "WoolUpperMesh",
            "primitives": [{
                "attributes": {"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2},
                "indices": 3,
                "material": 0
            }]
        },
        {
            "name": "CrepeSoleMesh",
            "primitives": [{
                "attributes": {"POSITION": 4, "NORMAL": 5, "TEXCOORD_0": 6},
                "indices": 7,
                "material": 1
            }]
        }
    ],
    "accessors": [
        {"bufferView": 0, "byteOffset": 0, "componentType": 5126, "count": len(upper_verts)//3, "type": "VEC3", "min": u_vmin, "max": u_vmax},
        {"bufferView": 1, "byteOffset": 0, "componentType": 5126, "count": len(upper_normals)//3, "type": "VEC3"},
        {"bufferView": 2, "byteOffset": 0, "componentType": 5126, "count": len(upper_uvs)//2, "type": "VEC2", "min": u_uvmin, "max": u_uvmax},
        {"bufferView": 3, "byteOffset": 0, "componentType": 5123, "count": len(upper_indices), "type": "SCALAR"},
        {"bufferView": 4, "byteOffset": 0, "componentType": 5126, "count": len(sole_verts)//3, "type": "VEC3", "min": s_vmin, "max": s_vmax},
        {"bufferView": 5, "byteOffset": 0, "componentType": 5126, "count": len(sole_normals)//3, "type": "VEC3"},
        {"bufferView": 6, "byteOffset": 0, "componentType": 5126, "count": len(sole_uvs)//2, "type": "VEC2", "min": s_uvmin, "max": s_uvmax},
        {"bufferView": 7, "byteOffset": 0, "componentType": 5123, "count": len(sole_indices), "type": "SCALAR"}
    ],
    "bufferViews": buffer_views,
    "buffers": [{"byteLength": len(buffer_data)}]
}

json_str = json.dumps(gltf_dict, separators=(',', ':'))
json_bytes = json_str.encode('utf-8')
# 4-byte pad json
pad_json = (4 - (len(json_bytes) % 4)) % 4
json_bytes += b' ' * pad_json

# 4-byte pad binary buffer
pad_bin = (4 - (len(buffer_data) % 4)) % 4
buffer_data += b'\x00' * pad_bin

# GLB Header
magic = 0x46546C67 # 'glTF'
version = 2
total_length = 12 + 8 + len(json_bytes) + 8 + len(buffer_data)

glb_bytes = bytearray()
glb_bytes.extend(struct.pack('<III', magic, version, total_length))
# Chunk 0: JSON
glb_bytes.extend(struct.pack('<II', len(json_bytes), 0x4E4F534A)) # 'JSON'
glb_bytes.extend(json_bytes)
# Chunk 1: BIN
glb_bytes.extend(struct.pack('<II', len(buffer_data), 0x004E4942)) # 'BIN\0'
glb_bytes.extend(buffer_data)

out_path = '/home/user/nyanopan-store/public/brand/nyanopan-slipper.glb'
with open(out_path, 'wb') as f:
    f.write(glb_bytes)

print(f"Generated perfect 3D GLTF: {out_path} ({len(glb_bytes)} bytes)")

