import { UploadOutlined } from "@ant-design/icons";
import Layout from "antd/lib/layout/layout";
import Text from "antd/lib/typography/Text";
import React from "react";
import "./App.scss";
import { Editor, Header } from "./components";
import { Util } from "./services/util";

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
    Util.onFileClick((path) => {
      this.onFileChange(path);
    });
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
        <Header onFileClick={this.onFileClick} />
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
      </Layout>
    );
  }
}

export default App;
