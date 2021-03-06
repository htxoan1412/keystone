const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password, Integer, Color, Relationship, Float, Select, DateTime, CloudinaryImage } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data');
const { LocationGoogle } = require('@keystonejs/fields-location-google');
const { CloudinaryAdapter } = require('@keystonejs/file-adapters');

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const PROJECT_NAME = 'first-app';
const adapterConfig = { mongoUri: 'mongodb://localhost/first-app' };



const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? true : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };
//access.userIsAdmin
keystone.createList('User', {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        update: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
    },
  },
  // List-level access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
});

keystone.createList('Nhanvien', {
  fields: {
    idTaiKhoan: {
       type: Relationship,ref: 'User',
       label:'ID t??i kho???n'
     
    },
    chucvu: {
      type: Text,
      label:'Ch???c v???'
    },

  },
  // List-level access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
});

keystone.createList('IMG', {
  fields: {
    anh: {
      type:Text,
      label:'???nh' 
    },
    
  }
});

keystone.createList("Phanloaisach",{
  fields:{
    loai:{
      type:Text,
      label:'Lo???i s??ch'
    },
    soLuong:{
      type:Integer,
      label:'S??? l?????ng'
    },
   
  },
});
keystone.createList("Nhacungcap",{
  fields:{
    ten:{
      type:Text,
      label:'T??n',
    },
    diaChi:{
      type:Text,
      label:'?????a ch???'
    },
    sdt:{
      type:Text,
      label:'SDT'
    },
    soLuong:{
      type:Integer,
      label:'S??? l?????ng'
    },
   
  },
});

keystone.createList("Phieunhapsach",{
  fields:{
    soLuong:{
      type:Integer,
      label:'S??? l?????ng'
    },
    tien:{
      type:Float,
      label:'Ti???n'
    },
    ngayNhap:{
      type:DateTime,
      label:'Ng??y nh???p'
    },
  },
});

keystone.createList("Sach",{
  fields:{
    tenSach:{
      type:Text,
      label:'T??n'
    },
    soLuong:{
      type:Integer,
      label:'S??? l?????ng'
    },
    gia:{
      type:Float,
      label:'Gia'
    },
    tenNhaXuatBan:{
      type:Text,
      label:'T??n NXB'
    },
    tenTacGia:{
      type:Text,
      label:'T??n t??c gi???'
    },
    soTrang:{
      type:Integer,
      label:'S??? trang'
    },
    ngayXuatBan:{
      type:DateTime,
      label:'Ng??y xu???t b???n'
    },
    id:{
      type:Text,

    },

  },
});
keystone.createList("Baiviet",{
  fields:{
    baiViet:{
      type:Text,
      label:'B??i vi???t'
    },
  },
});
keystone.createList("Chitietdonhang",{
  fields:{
    soLuong:{
      type:Integer,
      label:'S??? l?????ng'
    },
    tien:{
      type:Float,
      label:'Gi?? ti???n' 
    },
    
   
  },
});
keystone.createList("Giohang",{
  fields:{

  },

});
keystone.createList("Khachhang",{
  fields:{
   idTaiKhoan:{
     type:Text,
     label:'ID kh??ch h??ng'
   },
  },
});
keystone.createList('Donhang', {
  fields: {
    sdt: {
      type: Text,
      label:'SDT'
    },
    tongtien: {
      type: Float,
      label:'T???ng ti???n'
    },
    tinhTrangThanhToan: {
      type: Checkbox,options:'???? thanh to??n,ch??a thanh to??n',
      label:'T??nh tr???ng th??nh to??n'
    },
    tinhTrangGiao: {
      type: Checkbox, options:'Ch??? x??c nh???n,Ch??? l???y h??ng, ??ang giao, ???? giao',
      
      label:'T??nh tr???ng giao'
     
    },
    duyetBoiTaiKhoan: {
      type: Text,
      label:'Duy???t b???i t??i kho???n'
    },
    cachThucGiaoHang: {
      type: Text,
      label:'C??ch th???c giao h??ng'
    },
    ngayDat:
    {
      type: DateTime,
      label:'Ng??y ?????t'
    },
    ngayGiao: {
      type: DateTime,
      label:'Ng??y giao'
    },
    soLuong: {
      type: Integer,
      label:'S??? l?????ng'
    },
  },
  // List-level access controls
 
});
const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: { protectIdentities: process.env.NODE_ENV === 'production' },
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      authStrategy,
    }),
  ],
};
