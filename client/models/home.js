import moment from 'moment';
import BaseModel from 'react-apollo-models';

const FIELDS_ANNOUNCEMENT = `
    id
    title
    text
    createdAt
    author {
        id
        name
    }
`;

export default class HomeModel extends BaseModel {
    static query = {
        query: `
            query {
                me {
                    id
                    name
                    isAdmin
                }
                announcements {
                    ${FIELDS_ANNOUNCEMENT}
                }
            }
        `,
    }

    static mutations = [{
        mutation: `
            mutation createAnnouncement($input: CreateAnnouncementInput!) {
                createAnnouncement(input: $input) {
                    ${FIELDS_ANNOUNCEMENT}
                }
            }
        `,
        optimisticResponse: ({ props }) => ({
            __typename: 'Announcement',
            id: null,
            createdAt: moment().toISOString(),
            author: props.data.me,
        }),
        cacheUpdatePath: ({ item }) => ({
            announcements: {
                $push: [item],
            },
        }),
    }, {
        mutation: `
            mutation updateAnnouncement($input: UpdateAnnouncementInput!) {
                updateAnnouncement(input: $input) {
                    ${FIELDS_ANNOUNCEMENT}
                }
            }
        `,
        optimisticResponse: ({ props }) => ({
            __typename: 'Announcement',
            createdAt: moment().toISOString(),
            author: props.data.me,
        }),
    }, {
        mutation: `
            mutation deleteAnnouncement($id: ID!) {
                deleteAnnouncement(id: $id) {
                    ${FIELDS_ANNOUNCEMENT}
                }
            }
        `,
        cacheUpdatePath: ({ item }) => ({
            announcements: {
                $removeById: item.id,
            },
        }),
    }]
}
