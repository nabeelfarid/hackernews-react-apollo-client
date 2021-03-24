import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Link from "./Link";

export const FEED_QUERY = gql`
{
    feed {
        count 
        links {
          id
          url
          description
          createdAt
          postedBy {
              id
              name
          }
          votes {
              id
              user {
                  id
              }
          }
        }
      }
}
`


const LinkList = () => {
    const { data } = useQuery(FEED_QUERY);

    return (
        <div>
            {
                data &&
                data.feed.links.map((link, index) => (
                    <Link key={link.id} link={link} index={index}></Link>
                ))
            }
        </div>
    )
}

export default LinkList;