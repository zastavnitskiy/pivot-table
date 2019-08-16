export interface Order {
  rowId: number; // 1
  orderId: string; //"CA-2016-152156"
  orderDate: string; // "11/8/16",
  shipDate?: string; // "11/11/16",
  shipMode?: string; // "Second Class",
  customerId: string; //"CG-12520",
  customerName?: string; //"Claire Gute",
  segment?: string; //"Consumer",
  country?: string; // "United States",
  city?: string; // "Henderson",
  state?: string; //"Kentucky",
  postalCode?: string | number; //42420,
  region?: string; //"South",
  productId: string; //"FUR-BO-10001798",
  category?: string; //"Furniture",
  subCategory?: string; // "Bookcases",
  productName?: string; //  "Bush Somerset Collection Bookcase",
  sales: number; //261.96,
  quantity: number; //2,
  discount: number; //0,
  profit: number; //41.9136
}
