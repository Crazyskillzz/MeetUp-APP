// our-domain.com/
import Head from "next/head";

import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";
require("dotenv").config();

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>MeetUps</title>
        <meta
          name="description"
          content="Browse a huge list of higly active MeetUps all around the world!"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="../public/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="../public/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="../public/favicon-16x16.png"
        />
        <link rel="manifest" href="../public/site.webmanifest" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data form an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  // fetch data form an API

  const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ovjjp.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, // re pre-generates this apge on the server after deployment, without the need for rebuild and redeploy!
  };
}

export default HomePage;
