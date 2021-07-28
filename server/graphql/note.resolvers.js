import { Note, Carrier } from '@server/models';
import * as eventService from '@server/services/event-service';

export default {
  NoteAssignee: {
    user: (noteAssignee) => noteAssignee
  },
  Note: {
    addedBy: (note, _, { loaders }) => loaders.user.load(note.userId)
    // assignees: (quoteNote) => Note.relatedQuery('assignees').for(quoteNote.id)
  },
  Mutation: {
    // addQuoteNote: (_, { input }, { user }) =>
    //   Note.query().insertGraphAndFetch(
    //     {
    //       note: input.note,
    //       noteableType: 'Quote',
    //       noteableId: parseInt(input.quoteId, 10),
    //       addedBy: {
    //         id: parseInt(user.id, 10)
    //       },
    //       assignees: input.assignees.map((assigneeId) => {
    //         const isViewed = assigneeId === user.id;
    //         return {
    //           id: assigneeId,
    //           viewed: isViewed,
    //           viewedAt: isViewed ? new Date().toISOString() : null
    //         };
    //       })
    //     },
    //     { relate: true }
    //   ),
    addQuoteNote: async (_, { input }, { user }) => {
      const newNote = await Note.query().insertGraphAndFetch(
        {
          note: input.note,
          noteableType: 'Quote',
          noteableId: parseInt(input.quoteId, 10),
          addedBy: {
            id: parseInt(user.id, 10)
          }
        },
        { relate: true }
      );

      await eventService.logEvent(eventService.EVENT_TYPES.addQuoteNote, user, {
        quote: { id: input.quoteId },
        note: input.note
      });

      return newNote;
    },
    updateQuoteNote: async (_, { id, input }, { user }) => {
      const note = await Note.query().findById(id);
      const updatedNote = await Note.query().updateAndFetchById(id, input);

      await eventService.logEvent(eventService.EVENT_TYPES.updateQuoteNote, user, {
        quote: { id: note.noteableId },
        prevNote: note.note,
        note: input.note
      });

      return updatedNote;
    },
    deleteQuoteNote: async (_, { id }, { user }) => {
      const note = await Note.query().findById(id);

      await Note.query().deleteById(id);

      await eventService.logEvent(eventService.EVENT_TYPES.deleteQuoteNote, user, {
        quote: { id: note.noteableId },
        note: note.note
      });
    },
    viewQuoteNote: (_, { noteId }, { user }) => {
      Note.relatedQuery('assignees')
        .for(noteId)
        .where('assigneeId', parseInt(user.id, 10))
        .patch({ viewed: true, viewedAt: new Date().toISOString() })
        .returning('*');
    },
    addCarrierNote: (_, { carrierId, note }, { user }) =>
      Carrier.relatedQuery('notes')
        .for(carrierId)
        .insert({ note, userId: parseInt(user.id, 10) })
        .returning('*')
  }
};
