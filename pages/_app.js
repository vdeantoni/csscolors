import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CSS Colors</title>
        <meta
          name="description"
          content="Simple tool to browse CSS named colors"
        />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
