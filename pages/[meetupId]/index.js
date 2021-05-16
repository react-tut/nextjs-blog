import Head from "next/head";
import { MongoClient, ObjectID } from "mongodb";
import MeetupDetail from "../../components/meetups/meetupDetail";

const Meetup = (props) => {
  const meetup = props.meetup;
  return (
    <>
      <Head>
        <title>{meetup.title} - React Meetups</title>
        <meta name="description" content={meetup.description}></meta>
      </Head>
      <MeetupDetail
        image={meetup.image}
        title={meetup.title}
        address={meetup.address}
        description={meetup.description}
      />
    </>
  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect("mongodb://localhost:27017/meetups");
  const db = client.db();
  const meetupCollection = db.collection("meetups");
  const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect("mongodb://localhost:27017/meetups");
  const db = client.db();
  const meetupCollection = db.collection("meetups");
  const meetup = await meetupCollection.findOne({
    _id: ObjectID(meetupId),
  });
  client.close();

  return {
    props: {
      meetup: {
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
        id: meetup._id.toString(),
      },
    },
    revalidate: 10,
  };
};

export default Meetup;
