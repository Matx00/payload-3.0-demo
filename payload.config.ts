import path from 'path'
// import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from 'payload/i18n/en'
import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
// import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import FormBuilder from '@payloadcms/plugin-form-builder'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
console.log(typeof FormBuilder) // Check if it's a function or something else

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromName: 'Dott.ssa Iolanda Grasso',
    defaultFromAddress: 'admin@example.com',
    transportOptions: {
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    },
  }),
  //editor: slateEditor({}),
  editor: lexicalEditor(),
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        delete: () => false,
        update: () => false,
      },
      fields: [],
    },
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
    {
      slug: 'media',
      upload: true,
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  // db: mongooseAdapter({
  //   url: process.env.MONGODB_URI || '',
  // }),

  /**
   * Payload can now accept specific translations from 'payload/i18n/en'
   * This is completely optional and will default to English if not provided
   */
  i18n: {
    supportedLanguages: { en },
  },

  admin: {
    autoLogin: {
      email: 'wonderkido66@gmail.com',
      password: 'test',
      prefillOnly: true,
    },
  },
  // plugins: [
  //   FormBuilder({
  //     fields: {
  //       text: true,
  //       textarea: false,
  //       select: false,
  //       email: true,
  //       state: false,
  //       country: false,
  //       checkbox: true,
  //       number: true,
  //       message: true,
  //       payment: false,
  //     },
  //   }),
  // ],

  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'dev@payloadcms.com',
          password: 'test',
        },
      })
    }
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.

  // This is temporary - we may make an adapter pattern
  // for this before reaching 3.0 stable
  sharp,
})
