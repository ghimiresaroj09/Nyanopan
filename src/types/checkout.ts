export interface CheckoutOrderItem {
  product_name: string;
  variant_name: string;
  sku: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface CheckoutOrder {
  id: string;
  status: string;
  customer_name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  notes: string;
  company_name: string;
  pan_vat_number: string;
  city_district: string;
  delivery_location: string;
  delivery_location_name: string;
  product_subtotal: string;
  delivery_charge: string;
  subtotal: string;
  address: string;
  landmark: string;
  currency: string;
  items: CheckoutOrderItem[];
  created_at: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: CheckoutOrder;
}
