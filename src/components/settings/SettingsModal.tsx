import { Form, Input } from "antd";
import Modal from "antd/lib/modal/Modal";
import React from "react";
import { Settings } from "../../services/settings";

interface IProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const SettingsModal = ({
  visible,
  onOk,
  onCancel,
}: IProps): JSX.Element => {
  const [form] = Form.useForm();

  const submit = async (): Promise<void> => {
    try {
      await form.validateFields();
      Settings.setOutputDirectory(form.getFieldValue("output-directory"));
      onOk();
    } catch (e) {
      // do nothing
      cancel();
    }
  };

  const cancel = (): void => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal title="Settings" visible={visible} onOk={submit} onCancel={cancel}>
      <Form form={form} name="settings-form">
        <Form.Item
          name="output-directory"
          label="Output Directory"
          initialValue={Settings.getOutputDirectory()}
          rules={[
            {
              required: true,
              message: "Output is required",
            },
          ]}
        >
          {/* TODO: choose directory */}
          {/* <Button
            style={{ display: "inline", marginRight: "1px" }}
            icon={
              <Text type="secondary">
                <UploadOutlined />
              </Text>
            }
          /> */}
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};
