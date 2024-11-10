import { getPhotoUrl } from '@/lib/utils/misc'

export const nikeVerificationTemplate: Email = {
  id: '1e9e2f86-5c68-4f7b-9f86-5920ef954003',
  name: 'nike verification code',
  preview: 'Your Nike Member profile code...',
  fontFamily: 'Helvetica Neue, Arial, sans-serif',
  width: '450px',
  color: '#000000',
  bgColor: '#FFFFFF',
  rows: [
    {
      id: 'dea1443b-6450-4dbd-a51c-776e298f42e2',
      type: 'row',
      attributes: {
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '450px',
        },
      },
      columns: [
        {
          id: 'fc3b7f79-9490-4085-9ac2-dfd63a0b9923',
          type: 'column',
          gridColumns: 12,
          attributes: {
            align: 'center',
          },
          blocks: [
            {
              id: '5155b59c-1041-4667-b5e5-388997ba4c3b',
              type: 'image',
              content: '',
              attributes: {
                src: getPhotoUrl('nike-logo.png', 'nike-verification'),
                alt: 'Nike logo',
              },
            },
          ],
        },
      ],
    },
    {
      id: '945b27b1-bd3e-4014-8d56-60725e1a77d7',
      type: 'row',
      attributes: {
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '400px',
        },
      },
      columns: [
        {
          id: '3c6b9ac3-d1e7-444c-b177-e9cc8308e858',
          type: 'column',
          gridColumns: 12,
          attributes: {
            align: 'left',
          },
          blocks: [
            {
              id: 'a6719b8e-4c39-430d-b3fa-dd3b5a556d15',
              type: 'heading',
              content: 'Your Nike Member profile code',
              attributes: {
                as: 'h2',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000000',
                paddingBottom: '8px',
              },
            },
            {
              id: '7ed75518-e7dc-407d-8ef6-ebd05a08d12c',
              type: 'text',
              content: "Here's the one-time verification code you requested:",
              attributes: {
                fontSize: '16px',
                color: '#000000',
                paddingTop: '8px',
                paddingBottom: '16px',
                paddingLeft: '0px',
                paddingRight: '0px',
                lineHeight: '1.5',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'c750d3aa-c3e5-475f-8ed6-36432c7b50c9',
      type: 'row',
      attributes: {
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
        backgroundColor: '#FFFFFF',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '400px',
        },
      },
      columns: [
        {
          id: 'cfbb6f8a-76c3-4ab8-9d3d-d94a8eaab5ee',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: 'new-divider-1',
              type: 'divider',
              attributes: {
                borderWidth: '1px',
                borderColor: '#E0E0E0',
                paddingTop: '8px',
                paddingBottom: '8px',
              },
            },
            {
              id: 'a2c4be31-60f2-4438-80c3-133029dedf68',
              type: 'heading',
              content: '17586839',
              attributes: {
                textAlign: 'center',
                as: 'h2',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#000000',
                paddingBottom: '24px',
                paddingTop: '24px',
              },
            },
            {
              id: 'b13d4b47-fd1b-464b-9a9b-ea73ce7be650',
              type: 'divider',
              attributes: {
                borderWidth: '1px',
                borderColor: '#E0E0E0',
                paddingTop: '24px',
                paddingBottom: '8px',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'c719db0a-3348-4760-96e0-68dcb848c0e1',
      type: 'row',
      attributes: {
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      container: {
        align: 'left',
        attributes: {
          maxWidth: '600px',
        },
      },
      columns: [
        {
          id: 'f12c7a60-1517-4f4d-af21-00f1ae3091da',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: '63cddb80-df67-4f6e-9e26-8231b30595aa',
              type: 'text',
              content: '<strong>This code expires after 15 minutes.</strong>',
              attributes: {
                fontSize: '16px',
                color: '#000000',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '0px',
                paddingRight: '0px',
              },
            },
            {
              id: '2157b939-9bac-4b34-8419-6d4238af56c7',
              type: 'text',
              content: "If you've already received this code or don't need it anymore, ignore this email.",
              attributes: {
                fontSize: '16px',
                color: '#000000',
                paddingTop: '8px',
                paddingBottom: '16px',
                paddingLeft: '0px',
                paddingRight: '0px',
                lineHeight: '1.5',
              },
            },
          ],
        },
      ],
    },
    {
      id: '380c57db-49ec-4aca-9c68-b4608e0c2eaf',
      type: 'row',
      attributes: {
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
        backgroundColor: '#FFFFFF',
      },
      container: {
        align: 'center',
        attributes: {
          maxWidth: '600px',
        },
      },
      columns: [
        {
          id: 'fd06ec3b-db5f-40f9-9c4b-519c13cfdfb9',
          type: 'column',
          gridColumns: 12,
          attributes: {},
          blocks: [
            {
              id: '9f1fe24d-a4ea-4646-838b-fdb80bc2a8ed',
              type: 'link',
              content: 'Nike.com',
              attributes: {
                color: '#000000',
                textDecoration: 'none',
                href: 'https://www.nike.com',
                fontSize: '24px',
                fontWeight: 'bold',
                paddingBottom: '8px',
              },
            },
            {
              id: 'c191b61c-5912-44fa-8ab2-69089a7618bc',
              type: 'text',
              content:
                '© 2024 <strong>Nike</strong>, Inc. All Rights Reserved<br>One Bowerman Drive, Beaverton, Oregon 97005',
              attributes: {
                fontSize: '12px',
                color: '#000000',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '0px',
                paddingRight: '0px',
              },
            },
            {
              id: 'af144a58-046a-4b72-8f07-0234af713168',
              type: 'text',
              content: 'Privacy Policy  &nbsp;&nbsp; Get Help',
              attributes: {
                fontSize: '12px',
                color: '#000000',
                paddingTop: '8px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                paddingRight: '0px',
              },
            },
          ],
        },
      ],
    },
  ],
}
