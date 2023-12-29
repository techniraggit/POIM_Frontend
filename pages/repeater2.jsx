import React from 'react';
import { Form, Input, Space, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const YourFormComponent = () => {
  const [form] = Form.useForm();

  const calculateAmount = (quantity, unitPrice) => quantity * unitPrice;

  const handleQuantityRepeaterChange = (value, index) => {
    const unitPrice = form.getFieldValue(['items', index, 'unit_price']) || 0;
    const amount = calculateAmount(value, unitPrice);

    form.setFields([{ name: ['items', index, 'amount'], value: amount }]);
  };

  const handleUnitPriceRepeaterChange = (value, index) => {
    const quantity = form.getFieldValue(['items', index, 'quantity']) || 0;
    const amount = calculateAmount(quantity, value);

    form.setFields([{ name: ['items', index, 'amount'], value: amount }]);
  };

  return (
    <Form form={form} name="dynamic_form_nest_item" autoComplete="off">
      <Form.List name="items" initialValue={[]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'quantity']}
                  fieldKey={[fieldKey, 'quantity']}
                  label="Quantity"
                  rules={[{ required: true, message: 'Please enter quantity' }]}
                >
                  <Input
                    placeholder="Quantity"
                    onChange={(e) => handleQuantityRepeaterChange(e.target.value, index)}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'unit_price']}
                  fieldKey={[fieldKey, 'unit_price']}
                  label="Unit Price"
                  rules={[{ required: true, message: 'Please enter unit price' }]}
                >
                  <Input
                    placeholder="Unit Price"
                    onChange={(e) => handleUnitPriceRepeaterChange(e.target.value, index)}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'amount']}
                  fieldKey={[fieldKey, 'amount']}
                  label="Amount"
                  rules={[{ required: true, message: 'Amount is required' }]}
                >
                  <Input placeholder="Amount" readOnly />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                  fieldKey={[fieldKey, 'description']}
                  label="Description"
                  rules={[{ required: true, message: 'Please enter description' }]}
                >
                  <Input placeholder="Description" />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Add More Material
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default YourFormComponent;
