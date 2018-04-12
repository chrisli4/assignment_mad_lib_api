const UsersHelper = {};

UsersHelper.usersPath = () => `/users`;
UsersHelper.userPath = () => `/user`;
UsersHelper.newUserPath = () => `/user/new`;
UsersHelper.editUserPath = () => `/user/edit`;
UsersHelper.destroyUserPath = () => `/user?_method=delete`;

module.exports = UsersHelper;