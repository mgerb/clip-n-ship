import { SettingOutlined } from "@ant-design/icons";
import { Button, PageHeader } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useState } from "react";
import { SettingsModal } from "../settings/SettingsModal";

export const Header = (): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <PageHeader
        title="Clip N Ship"
        subTitle="some/file/test/123"
        ghost={false}
        extra={[
          <Text type="secondary">
            <Button
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
