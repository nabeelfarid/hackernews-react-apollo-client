import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { useHistory } from "react-router";
import { FEED_QUERY } from "./LinkList";

const CREATE_LINK_MUTATION = gql`
    mutation PostMutation($description: String!, $url: String!) {
        post(description: $description, url: $url) {
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
`

const CreateLink = () => {
    const history = useHistory();

    const [formState, setFormState] = useState({
        description: '',
        url: ''
    })
    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            description: formState.description,
            url: formState.url
        },
        onCompleted: () => {
            history.push('/')
        },
        update: (cache, mutationResult) => {
            // const post = mutationResult.data.post;
            // const data = cache.readQuery({
            //     query: FEED_QUERY,
            // });
            
            // cache.writeQuery({
            //     query: FEED_QUERY,
            //     data: {
            //         feed: {
            //             __typename: data.feed.__typename,
            //             count: data.feed.count + 1,
            //             links: [...data.feed.links, post],
            //         }
            //     }
            // });

            //remove all root query feeds from cache. This will remove all the the search queries as well
            cache.evict({ 
                id: "ROOT_QUERY", 
                field: "feed"
              })
        }
    })

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault();
                createLink();
            }}>
                <div className="flex flex-column mt3">
                    <input
                        className='mb2'
                        type='text'
                        value={formState.description}
                        onChange={(e) => setFormState({
                            ...formState,
                            description: e.target.value
                        })}
                        placeholder='A description for the link'
                    />
                    <input
                        className='mb2'
                        type='text'
                        value={formState.url}
                        onChange={(e) => setFormState({
                            ...formState,
                            url: e.target.value
                        })}
                        placeholder='The URL for the link'

                    />
                </div>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default CreateLink;