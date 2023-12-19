// pages/index.js
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const YourPage = () => {
  const onFinish = (values) => {
    console.log('Received values:', values);
    // Handle the form submission logic here
  };

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.Item name="groupName" label="Group Name" rules={[{ required: true, message: 'Please enter group name' }]}>
        <Input placeholder="Group Name" />
      </Form.Item>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'itemName']}
                  fieldKey={[fieldKey, 'itemName']}
                  label="Name"
                  rules={[{ required: true, message: 'Please enter name' }]}
                >
                  <Input placeholder="Name" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'itemEmail']}
                  fieldKey={[fieldKey, 'itemEmail']}
                  label="Email"
                  rules={[{ required: true, message: 'Please enter email' }]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'itemPhoneNumber']}
                  fieldKey={[fieldKey, 'itemPhoneNumber']}
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="Phone Number" />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Add Item
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default YourPage;
