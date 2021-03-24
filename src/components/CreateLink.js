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
        onCompleted: () => history.push('/'),
        update: (cache, { data: { post } }) => {
            const data = cache.readQuery({
                query: FEED_QUERY,
            });

            cache.writeQuery({
                query: FEED_QUERY,
                data: {
                    feed: {
                        links: [post, ...data.feed.links]
                    }
                }
            });
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