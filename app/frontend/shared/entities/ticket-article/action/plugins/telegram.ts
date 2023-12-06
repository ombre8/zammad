// Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

import type {
  TicketArticleAction,
  TicketArticleActionPlugin,
  TicketArticleType,
} from './types.ts'

const actionPlugin: TicketArticleActionPlugin = {
  order: 300,

  addActions(ticket, article) {
    const sender = article.sender?.name
    const type = article.type?.name

    if (sender !== 'Customer' || type !== 'telegram personal-message') return []

    const action: TicketArticleAction = {
      apps: ['mobile'],
      label: __('Reply'),
      name: 'telegram personal-message',
      icon: { mobile: 'mobile-reply', desktop: 'desktop-reply' },
      view: {
        agent: ['change'],
      },
      perform(ticket, article, { openReplyDialog }) {
        const articleData = {
          articleType: type,
          inReplyTo: article.messageId,
        }

        openReplyDialog(articleData)
      },
    }
    return [action]
  },

  addTypes(ticket) {
    const descriptionType = ticket.createArticleType?.name

    if (descriptionType !== 'telegram personal-message') return []

    const type: TicketArticleType = {
      apps: ['mobile'],
      value: 'telegram personal-message',
      label: __('Telegram'),
      icon: {
        mobile: 'mobile-telegram',
        desktop: 'desktop-telegram',
      },
      view: {
        agent: ['change'],
      },
      attributes: ['attachments'],
      internal: false,
      contentType: 'text/plain',
      validation: {
        body: 'length:1,10000',
      },
      editorMeta: {
        footer: {
          maxlength: 10000,
          warningLength: 5000,
        },
      },
    }
    return [type]
  },
}

export default actionPlugin
