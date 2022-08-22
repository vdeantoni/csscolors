import "@fortawesome/fontawesome-svg-core/styles.css";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CSS Colors</title>
        <meta name="description" content="Simple tool to browse CSS named colors" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
