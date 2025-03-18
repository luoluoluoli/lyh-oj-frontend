import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Input, Button, Radio, Select, InputNumber, Row, Col, Card, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { addQuestionUsingPost } from '@/services/problem/api';



const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const AddQuestionPage: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: API.QuestionAddRequest) => {
    try {
      setSubmitting(true);
      const response = await addQuestionUsingPost({
        ...values,
        judgeCase: values.judgeCase,
        judgeConfig: values.judgeConfig
      });
      if (response.code === 0) {
        message.success('题目添加成功');
        form.resetFields();
      } else {
        message.error(`添加失败：${response.message}`);
      }
    } catch (error) {
      message.error('添加失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Card bordered={false}>
          <Form
            form={form}
            {...formItemLayout}
            layout="horizontal"
            onFinish={onFinish}
            initialValues={{
              judgeConfig: {
                timeLimit: 1000,
                memoryLimit: 128,
                stackLimit: 128,
              },
              judgeCase: [{}] // 默认一个测试用例
            }}
            colon={false}
          >
            {/* 基础信息 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="标题"
                  name="title"
                  rules={[{ required: true, message: '请输入题目标题' }]}
                >
                  <Input placeholder="请输入题目标题" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="难度"
                  name="difficulty"
                  rules={[{ required: true, message: '请选择题目难度' }]}
                >
                  <Radio.Group>
                    <Radio.Button value="easy">简单</Radio.Button>
                    <Radio.Button value="medium">中等</Radio.Button>
                    <Radio.Button value="hard">困难</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            {/* 标签 */}
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="标签"
                  name="tags"
                  rules={[{ required: true, message: '请至少输入一个标签' }]}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  <Select
                    mode="tags"
                    placeholder="请输入标签（回车确认）"
                    tokenSeparators={[',']}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 判题配置 */}
            <Card title="判题配置" style={{ marginBottom: 24 }} headStyle={{ border: 'none' }}>
              <Row gutter={24} justify="space-between">
                <Col span={8}>
                  <Form.Item
                    label="时间限制（ms）"
                    name={['judgeConfig', 'timeLimit']}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={100}
                      max={10000}
                      style={{ width: '100%' }}
                      placeholder="100-10000"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="内存限制（MB）"
                    name={['judgeConfig', 'memoryLimit']}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={64}
                      max={1024}
                      style={{ width: '100%' }}
                      placeholder="64-1024"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="堆栈限制（MB）"
                    name={['judgeConfig', 'stackLimit']}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={64}
                      max={1024}
                      style={{ width: '100%' }}
                      placeholder="64-1024"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 测试用例 */}
            <Card title="测试用例" style={{ marginBottom: 24 }} headStyle={{ border: 'none' }}>
              <Form.List name="judgeCase">
                {(fields, { add, remove }) => (
                  <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <div key={key} style={{ marginBottom: 16 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 8,
                          padding: '8px 12px',
                          backgroundColor: '#fafafa',
                          borderRadius: 4
                        }}>
                          <span style={{ marginRight: 12 }}>测试用例-{index + 1}</span>
                          {fields.length > 1 && (
                            <Button
                              type="text"
                              danger
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(name)}
                              size="small"
                            />
                          )}
                        </div>

                        <Row gutter={16} align="middle">
                          <Col span={11}>
                            <Form.Item
                              {...restField}
                              name={[name, 'input']}
                              label="输入"
                              labelCol={{ span: 24 }}
                              rules={[{ required: true, message: '请输入输入用例' }]}
                            >
                              <Input.TextArea
                                placeholder="输入用例"
                                rows={3}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>

                          <Col span={11}>
                            <Form.Item
                              {...restField}
                              name={[name, 'output']}
                              label="输出"
                              labelCol={{ span: 24 }}
                              rules={[{ required: true, message: '请输入输出用例' }]}
                            >
                              <Input.TextArea
                                placeholder="输出用例"
                                rows={3}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    ))}

                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ maxWidth: 200, margin: '16px auto 0' }}
                    >
                      新增测试用例
                    </Button>
                  </div>
                )}
              </Form.List>
            </Card>

            {/* 题目内容 */}
            <Card title="题目内容" headStyle={{ border: 'none' }}>
              <Form.Item
                name="content"
                rules={[{ required: true, message: '请输入题目内容' }]}
                wrapperCol={{ span: 24 }}
              >
                <Input.TextArea
                  rows={12}
                  placeholder="请输入题目详细内容（支持Markdown格式）"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Card>

            {/* 提交按钮 */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
                style={{ width: 200, height: 40 }}
              >
                提交题目
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AddQuestionPage;
