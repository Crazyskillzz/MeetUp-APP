// our-domain.com/
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
require("dotenv").config();

function HomePage(props) {
  return <MeetupList meetups={props.meetups} />;
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
