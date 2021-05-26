import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Layout from "antd/lib/layout/layout";
import Text from "antd/lib/typography/Text";
import React from "react";
import "./App.scss";
import { Editor, Header } from "./components";

interface IState {
  filePath?: string;
}

class App extends React.Component<unknown, IState> {
  constructor(props: unknown) {
    super(props);
    this.state = {};
  }

  public componentDidMount(): void {
    document.addEventListener("drop", this.dropListener);
    document.addEventListener("dragover", this.dragListener, false);
  }

  private dropListener = (event: DragEvent) => {
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.onFileChange(file.path);
    }
  };

  private dragListener = (event: DragEvent) => {
    event.preventDefault();
  };

  public componentWillUnmount(): void {
    document.removeEventListener("drop", this.dropListener);
    document.removeEventListener("dragover", this.dragListener);
  }

  private onFileClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement)?.files?.[0];
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

  public render(): JSX.Element {
    const { filePath } = this.state;

    return (
      <Layout style={{ height: "100%", paddingBottom: "1rem" }}>
        <Header />
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
