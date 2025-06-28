import request from '../utils/request';
import { 
  User, 
  UserFormData, 
  PaginationParams, 
  PaginationResult 
} from '@/types/user';
import users from './mock.json';
  
  // 模拟 API 延迟
  const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const userService = {
    // 获取所有用户
    getUsers: async (params = {}) => {
      await simulateDelay(300);
      
      // 模拟分页
      const { page = 1, pageSize = 10, search } = params;
      let filteredUsers = [...users];
      
      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.includes(search) || user.email.includes(search)
        );
      }
      
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedUsers = filteredUsers.slice(start, end);
      
      return {
        data: paginatedUsers,
        total: filteredUsers.length,
        page,
        pageSize
      };
    },
    
    // 获取单个用户
    getUserById: async (id) => {
      await simulateDelay(200);
      const user = users.find(u => u.id === id);
      if (!user) {
        throw new Error('用户不存在');
      }
      return user;
    },
    
    // 创建用户
    createUser: async (userData) => {
      await simulateDelay(400);
      const newUser = {
        id: users.length + 1,
        ...userData,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      return newUser;
    },
    
    // 更新用户
    updateUser: async (id, updates) => {
      await simulateDelay(500);
      const index = users.findIndex(u => u.id === id);
      if (index === -1) {
        throw new Error('用户不存在');
      }
      users[index] = { ...users[index], ...updates };
      return users[index];
    },
    
    // 删除用户
    deleteUser: async (id) => {
      await simulateDelay(300);
      const index = users.findIndex(u => u.id === id);
      if (index === -1) {
        throw new Error('用户不存在');
      }
      users.splice(index, 1);
      return { success: true };
    }
  };

// 获取用户列表
export const getUsers = (
  params?: PaginationParams
): Promise<PaginationResult<User>> => {
  return userService.getUsers(params);
};

// 添加用户
export const addUser = (data: UserFormData): Promise<User> => {
  return  userService.createUser(data);
};

// 更新用户
export const updateUser = (
  id: number, 
  data: Partial<UserFormData>
): Promise<User> => {
  return userService.updateUser(id, data);
};

// 删除用户
export const deleteUser = (id: number): Promise<void> => {
  return userService.deleteUser(id);
};