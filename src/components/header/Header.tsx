import { SettingOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useState } from "react";
import { SettingsModal } from "../settings/SettingsModal";

interface IProps {
  onFileClick: () => void;
}

export const Header = ({ onFileClick }: IProps): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <PageHeader
        title="Clip N Ship"
        ghost={false}
        extra={[
          <Text type="secondary">
            <Button
              title="Select File"
              shape="circle"
              icon={
                <Text type="secondary">
                  <UploadOutlined type="secondary" />
                </Text>
              }
              onClick={onFileClick}
            ></Button>
          </Text>,
          <Text type="secondary">
            <Button
              title="Settings"
              shape="circle"
              icon={
                <Text type="secondary">
                  <SettingOutlined type="secondary" />
                </Text>
              }
              onClick={() => setShowModal(!showModal)}
            ></Button>
          </Text>,
        ]}
      />
      <SettingsModal
        visible={showModal}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
      ></SettingsModal>
    </>
  );
};
