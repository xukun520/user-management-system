import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  message, 
  Popconfirm, 
  Card, 
  Input,
  Tag,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import { getUsers, addUser, updateUser, deleteUser } from '../../api/user';
import UserModal from '../../components/UserModal';
import { User, UserFormData, PaginationResult } from '@/types/user';
import './style.less';

const { Search } = Input;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('添加用户');

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: User) => (
        <Tooltip title={record.description}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: User['role']) => {
        let color = '';
        switch (role) {
          case 'admin':
            color = 'red';
            break;
          case 'editor':
            color = 'blue';
            break;
          default:
            color = 'green';
        }
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定要删除此用户吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchUsers = async (params?: { page?: number; pageSize?: number }) => {
    setLoading(true);
    try {
      const { current, pageSize } = pagination;
      const queryParams = {
        page: params?.page || current,
        pageSize: params?.pageSize || pageSize,
        search: searchText,
      };
      
      const response: PaginationResult<User> = await getUsers(queryParams);
      setUsers(response.data);
      setPagination({
        ...pagination,
        current: queryParams.page,
        pageSize: queryParams.pageSize,
        total: response.total,
      });
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, searchText]);

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleAdd = () => {
    setCurrentUser(null);
    setModalTitle('添加用户');
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setCurrentUser(record);
    setModalTitle('编辑用户');
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: UserFormData) => {
    try {
      if (currentUser) {
        // 编辑
        await updateUser(currentUser.id, values);
        message.success('更新成功');
      } else {
        // 新增
        await addUser(values);
        message.success('添加成功');
      }
      fetchUsers();
    } catch (error) {
      message.error(currentUser ? '更新失败' : '添加失败');
    }
  };

  return (
    <div className="user-management">
      <Card
        title="用户管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加用户
          </Button>
        }
      >
        <div className="table-header">
          <Search
            placeholder="输入用户名或邮箱搜索"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          bordered
          scroll={{ x: 'max-content' }}
        />
      </Card>
      
      <UserModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={currentUser}
        title={modalTitle}
      />
    </div>
  );
};

export default UserManagement;