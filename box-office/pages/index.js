import React from "react";
import Head from "next/head";
import axios from "axios";
import Error from "next/error";
import Link from "next/link";

function Home(props) {
  if (props.error) {
    return <Error statusCode={500} title={props.error.message} />;
  }
  if (props.data.faultInfo) {
    return <Error statusCode={500} title={props.data.faultInfo.message} />;
  }

  console.log(props.data.boxOfficeResult.dailyBoxOfficeList);
  return (
    <div>
      <Head>
        <title>Box Office</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>박스 오피스</h1>
      <p>2020년 08월 07일</p>
      {props.data.boxOfficeResult.dailyBoxOfficeList.map((item) => (
        <div key={item.movieCd}>
          [{item.rank}] &nbsp;
          <Link href="/movies/[code]" as={"/movies/" + item.movieCd}>
            <a>{item.movieNm}</a>
          </Link>
          &nbsp;
          <small>({item.openDt})</small>
        </div>
      ))}
    </div>
  );
}

Home.getInitialProps = async function (context) {
  let url =
    "https://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json";
  url += "?key=" + process.env.KEY;
  //url += "?key=";
  url += "&targetDt=20200807";

  // Promise -> async/await
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.warn(error);
    return {
      error,
    };
  }
};

export default Home;
