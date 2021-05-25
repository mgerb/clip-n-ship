import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Layout from "antd/lib/layout/layout";
import Text from "antd/lib/typography/Text";
import React from "react";
import "./App.scss";
import { Editor } from "./components";

interface IState {
  filePath?: string;
}

class App extends React.Component<any, IState> {
  private dropListener: any;
  private dragListener: any;

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.dropListener = document.addEventListener("drop", (event) => {
      const file: any = event.dataTransfer?.files[0];
      if (file) {
        this.onFileChange(file.path);
      }
    });
    this.dragListener = document.addEventListener(
      "dragover",
      (event) => {
        event.preventDefault();
      },
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener("drop", this.dropListener);
    document.removeEventListener("dragover", this.dragListener);
  }

  private onFileClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: any) => {
      const file = e.target?.files[0];
      if (file) {
        this.onFileChange(file.path);
      }
      if (document.contains(input)) {
        document.removeChild(input);
      }
    };
    input.click();
  };

  private onFileChange(path: string): void {
    if (path !== this.state.filePath) {
      this.setState(
        {
          filePath: undefined,
        },
        () => {
          this.setState({
            filePath: path,
          });
        }
      );
    }
  }

  render() {
    const { filePath } = this.state;

    return (
      <Layout style={{ height: "100%", paddingBottom: "1rem" }}>
        {filePath ? (
          <Editor filePath={filePath} />
        ) : (
          <div className="drop-zone" onClick={this.onFileClick}>
            <h1>
              <Text type="secondary">
                <UploadOutlined style={{ fontSize: "2rem" }} />
              </Text>
              <br />
              <Text type="secondary">
                Click to select or drag and drop media
              </Text>
            </h1>
          </div>
        )}

        {filePath && (
          <Button
            style={{ margin: "1rem" }}
            icon={<UploadOutlined />}
            onClick={this.onFileClick}
          >
            Choose File
          </Button>
        )}
      </Layout>
    );
  }
}

export default App;
