import User from "../page/admin/User";
import Kind from "../page/admin/Kind";
import Admin from "../page/admin/Admin";
import WellCome from "../page/product/Product";

const Routes = [
  {
    title: 'Home',
    path: '/',
    exact: true,
    component: WellCome
  },
  {
    title: 'Admin',
    path: '/admins',
    component: Admin
  },
  {
    title: 'User',
    path: '/users',
    component: User
  },
  {
    title: 'Kind',
    path: '/kinds',
    component: Kind
  }
]
export default Routes;