// 用户基础信息
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    phone?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // 用户表单数据（不包含id和创建时间）
  export interface UserFormData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    password?: string;
  }
  
  // 分页查询参数
  export interface PaginationParams {
    page?: number;
    pageSize?: number;
    search?: string;
  }
  
  // 分页查询结果
  export interface PaginationResult<T> {
    data: T[];
    total: number;
  }