import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { User, UserFormData } from '@/types/user';

const { Option } = Select;
const { TextArea } = Input;

interface UserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormData) => void;
  initialValues?: User | null;
  title?: string;
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title = '用户信息',
}) => {
  const [form] = Form.useForm<UserFormData>();

  // 初始化表单值
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      onCancel();
    } catch (error) {
      message.error('请填写完整信息');
    }
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      forceRender
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        
        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select placeholder="请选择角色">
            <Option value="admin">管理员</Option>
            <Option value="editor">编辑</Option>
            <Option value="viewer">查看者</Option>
          </Select>
        </Form.Item>
        
        {!initialValues && (
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}
        
        <Form.Item name="phone" label="手机号">
          <Input placeholder="请输入手机号" />
        </Form.Item>
        
        <Form.Item name="description" label="描述">
          <TextArea placeholder="请输入描述信息" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;