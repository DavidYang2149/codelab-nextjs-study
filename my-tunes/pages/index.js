import React from "react";
import { Button, Table, Form, Input } from "antd";
import axios from "axios";
import Router from "next/router";

function Home(props) {
  // Table - Antd 설정
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "아티스트",
      dataIndex: "artist",
      key: "artist",
    },
    {
      title: "앨범명",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "삭제",
      dataIndex: "id",
      key: "remove",
      render: (value) => (
        <Button
          size={"small"}
          type={"danger"}
          onClick={() => {
            if (!confirm("정말 삭제하시겠습니까?")) {
              return false;
            }
            axios
              .delete(process.env.API_HOST + "/api/albums/" + value)
              .then((response) => {
                load();
              })
              .catch((error) => {
                console.warn(error);
              });
          }}
        >
          삭제
        </Button>
      ),
    },
  ];
  // 관리 Props, state
  const [albums, setAlbums] = React.useState(props.albums);
  const load = async () => {
    const albums = await axios.get(process.env.API_HOST + "/api/albums");
    setAlbums(albums.data);
  };

  return (
    <div style={{ padding: 24 }}>
      <Table dataSource={albums} columns={columns} rowKey={"id"} />

      <Form
        onFinish={(values) => {
          axios
            .post(process.env.API_HOST + "/api/albums", values)
            .then((response) => {
              // response.data -> { id: n, artist: '', title: '' }
              /*
              // case 1
              setAlbums( [
                response.data,
                ...albums,
              ] )
            */
              /*
              // case 2
              setAlbums( response.data )
           */

              // 데이터만 다시 로드
              load();

              // 페이지 새로 고침
              // Router.reload();
            })
            .catch((error) => console.warn(error));
        }}
      >
        <Form.Item
          name={"artist"}
          label={"아티스트"}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={"title"} label={"타이틀"} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type={"primary"} htmlType={"submit"}>
            전송
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

Home.getInitialProps = async () => {
  const albums = await axios.get(process.env.API_HOST + "/api/albums");
  return {
    albums: albums.data,
  };
};

export default Home;
