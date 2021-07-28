import arrayDifference from 'lodash/difference';
import arrayIntersection from 'lodash/intersection';
import { Quote, Status, User, EmailTemplate } from '@server/models';
import { getDateTimeStringFromTimestamp, getDateStringFromDateObject } from '@server/lib/date-format';
import diffJson from '@server/lib/diff-json';
import runPromiseSerial from '@server/lib/promise-serial';
import Alias from '@server/constants/alias';
import { referrers } from '@server/constants/referrers';

export const EVENT_TYPES = {
  createQuote: 'CREATE_QUOTE',
  updateQuote: 'UPDATE_QUOTE',
  addQuoteNote: 'ADD_QUOTE_NOTE',
  updateQuoteNote: 'UPDATE_QUOTE_NOTE',
  deleteQuoteNote: 'DELETE_QUOTE_NOTE',
  updateQuoteNotes: 'UPDATE_QUOTE_NOTES',
  setFollowup: 'SET_FOLLOWUP_TO_QUOTE',
  duplicateQuote: 'DUPLICATE_QUOTE',
  trackEmail: 'TRACK_EMAIL'
};

const loggerBuilder = (user, quoteId) => (description) =>
  Quote.relatedQuery('events').for(quoteId).insert({
    userId: user ? user.id : null,
    description,
    eventDate: (new Date()).toISOString()
  });

const logCreateQuote = async (user, eventData) => {
  const logger = loggerBuilder(user, eventData.quote.id);
  if (user) {
    await logger(`${user.firstName} ${user.lastName} created ${eventData.quote.isOrder ? 'an order' : 'a quote'}`);
  } else {
    const referrer = referrers.find((r) => r.value === eventData.quote.referrer);
    await logger(`${eventData.quote.isOrder ? 'an order' : 'a quote'} was created from ${referrer.label}`);
  }
};

const logUpdateQuote = async (user, eventData) => {
  const { quote, patched } = eventData;
  const logger = loggerBuilder(user, quote.id);

  if (patched.isOrder && !quote.isOrder) {
    await logger(`${user.firstName} ${user.lastName} converted to an order`);
  } else if (!patched.isOrder && quote.isOrder) {
    await logger(`${user.firstName} ${user.lastName} converted to a quote`);
  }

  if (patched.referrer && patched.referrer !== quote.referrer) {
    const fromReferrer = referrers.find((r) => r.value === quote.referrer);
    const toReferrer = referrers.find((r) => r.value === patched.referrer);
    await logger(`${user.firstName} ${user.lastName} updated the referrer from ${fromReferrer.label} to ${toReferrer.label}`);
  }

  if (patched.parentStatusId && quote.parentStatusId !== patched.parentStatusId) {
    let status1 = null;
    if (quote.parentStatusId) {
      status1 = await Status.query().findById(quote.parentStatusId);
    }
    const status2 = await Status.query().findById(patched.parentStatusId);

    let description = '';

    if (!status1) {
      description = `${user.firstName} ${user.lastName} updated the status to ${status2.name}`;
    } else {
      description = `${user.firstName} ${user.lastName} updated the status from ${status1.name} to ${status2.name}`;
    }

    await logger(description);
  }

  if (patched.childStatusId && quote.childStatusId !== patched.childStatusId) {
    let status1 = null;
    if (quote.childStatusId) {
      status1 = await Status.query().findById(quote.childStatusId);
    }
    const status2 = await Status.query().findById(patched.childStatusId);

    let description = '';

    if (!status1) {
      description = `${user.firstName} ${user.lastName} updated the child status to ${status2.name}`;
    } else {
      description = `${user.firstName} ${user.lastName} updated the child status from ${status1.name} to ${status2.name}`;
    }

    await logger(description);
  }

  if (patched.assigneeId && quote.assigneeId !== patched.assigneeId) {
    const assignee1 = await User.query().findById(quote.assigneeId);
    const assignee2 = await User.query().findById(patched.assigneeId);

    await logger(`${user.firstName} ${user.lastName} changed the assignee from ${assignee1.firstName} ${assignee1.lastName} into ${assignee2.firstName} ${assignee2.lastName}`);
  }

  const shipperDiff = diffJson(quote.shipper, patched.shipper);
  if (patched.shipper && shipperDiff) {
    let updates = '';
    Object.keys(shipperDiff).forEach((key) => {
      if (Alias[key] && key in patched.shipper) {
        const update = `${Alias[key]}: ${quote.shipper[key]} -> ${patched.shipper[key]}`;
        updates = updates ? `${updates}, ${update}` : update;
      }
    });
    await logger(`${user.firstName} ${user.lastName} updated the shipper information. ${updates}`);
  }

  if (patched.transport && typeof patched.transport.availableDate === 'object') {
    patched.transport.availableDate = getDateStringFromDateObject(patched.transport.availableDate);
  }
  const transportDiff = diffJson(quote.transport, patched.transport);
  if (patched.transport && transportDiff) {
    let updates = '';
    Object.keys(transportDiff).forEach((key) => {
      if (Alias[key] && key in patched.transport) {
        const update = `${Alias[key]}: ${quote.transport[key]} -> ${patched.transport[key]}`;
        updates = updates ? `${updates}, ${update}` : update;
      }
    });
    await logger(`${user.firstName} ${user.lastName} updated the transport information. ${updates}`);
  }

  const originDiff = diffJson(quote.origin, patched.origin);
  if (patched.origin && originDiff) {
    let updates = '';
    Object.keys(originDiff).forEach((key) => {
      if (Alias[key] && key in patched.origin) {
        const update = `${Alias[key]}: ${quote.origin[key]} -> ${patched.origin[key]}`;
        updates = updates ? `${updates}, ${update}` : update;
      }
    });
    await logger(`${user.firstName} ${user.lastName} updated the origin information. ${updates}`);
  }

  const destinationDiff = diffJson(quote.destination, patched.destination);
  if (patched.destination && destinationDiff) {
    let updates = '';
    Object.keys(destinationDiff).forEach((key) => {
      if (Alias[key] && key in patched.destination) {
        const update = `${Alias[key]}: ${quote.destination[key]} -> ${patched.destination[key]}`;
        updates = updates ? `${updates}, ${update}` : update;
      }
    });
    await logger(`${user.firstName} ${user.lastName} updated the destination information. ${updates}`);
  }

  const vehiclesDiff = diffJson(quote.vehicles, patched.vehicles);
  if (patched.vehicles && vehiclesDiff) {
    let updates1 = '';
    quote.vehicles.forEach((v) => {
      const update = `(${v.year}, ${v.make}, ${v.model})`;
      updates1 = updates1 ? `${updates1}, ${update}` : update;
    });

    let updates2 = '';
    patched.vehicles.forEach((v) => {
      const update = `(${v.year}, ${v.make}, ${v.model})`;
      updates2 = updates2 ? `${updates2}, ${update}` : update;
    });
    await logger(`${user.firstName} ${user.lastName} updated the vehicles information. ${updates1} -> ${updates2}`);
  }
};

const logAddQuoteNote = async (user, eventData) => {
  const quoteId = eventData.quote.id;
  const logger = loggerBuilder(user, quoteId);
  await logger(`${user.firstName} ${user.lastName} added a note: "${eventData.note}"`);
};

const logUpdateQuoteNote = async (user, eventData) => {
  const quoteId = eventData.quote.id;
  const logger = loggerBuilder(user, quoteId);
  await logger(`${user.firstName} ${user.lastName} updated a note from "${eventData.prevNote}" to "${eventData.note}"`);
};

const logDeleteQuoteNote = async (user, eventData) => {
  const quoteId = eventData.quote.id;
  const logger = loggerBuilder(user, quoteId);
  await logger(`${user.firstName} ${user.lastName} deleted a note: "${eventData.note}"`);
};

const logUpdateQuoteNotes = async (user, eventData) => {
  const quoteId = eventData.quote.id;
  const { quote } = eventData;
  const newNoteIds = eventData.notes.filter((n) => ('id' in n)).map((n) => parseInt(n.id, 10));
  const existingNoteIds = quote.internalNotes.filter((n) => ('id' in n)).map((n) => n.id);

  const addedNotes = eventData.notes.filter((n) => !('id' in n));
  const deletedNoteIds = arrayDifference(existingNoteIds, newNoteIds);
  const possiblyUpdatedNoteIds = arrayIntersection(newNoteIds, existingNoteIds);

  const logger = loggerBuilder(user, quoteId);

  if (addedNotes.length > 0) {
    const promiseSerial = addedNotes.map((note) => async () => {
      await logger(`${user.firstName} ${user.lastName} added a note: "${note.note}"`);
    });
    await runPromiseSerial(promiseSerial);
  }

  if (deletedNoteIds.length > 0) {
    const promiseSerial = deletedNoteIds.map((noteId) => async () => {
      const note = quote.internalNotes.find((n) => n.id === noteId);
      await logger(`${user.firstName} ${user.lastName} deleted a note: "${note.note}"`);
    });
    await runPromiseSerial(promiseSerial);
  }

  if (possiblyUpdatedNoteIds.length > 0) {
    const promiseSerial = possiblyUpdatedNoteIds
      .filter((noteId) => {
        const prevNote = quote.internalNotes.find((n) => n.id === noteId);
        const note = eventData.notes.find((n) => parseInt(n.id, 10) === noteId);
        return prevNote.note !== note.note;
      })
      .map((noteId) => async () => {
        const prevNote = quote.internalNotes.find((n) => n.id === noteId);
        const note = eventData.notes.find((n) => parseInt(n.id, 10) === noteId);
        await logger(`${user.firstName} ${user.lastName} updated a note from "${prevNote.note}" to "${note.note}"`);
      });
    await runPromiseSerial(promiseSerial);
  }
};

const logSetFollowups = async (user, eventData) => {
  const logger = loggerBuilder(user, eventData.quote.id);
  let updates = '';
  eventData.followups.forEach((f) => {
    const followupOn = getDateStringFromDateObject(f.followupOn);
    updates = updates ? `${updates}, ${followupOn}` : followupOn;
  });
  await logger(`${user.firstName} ${user.lastName} did set a followup(s): Current followups are on ${updates}`);
};

const logDuplicateQuote = async (user, eventData) => {
  const logger = loggerBuilder(user, eventData.quote.id);
  await logger(`${user.firstName} ${user.lastName} duplicated this, and the new ${eventData.quote.isOrder ? 'order' : 'quote'} is #${eventData.quote.id}`);
};

const logTrackEmail = async (tracking) => {
  const emailActionTexts = {
    processed: 'processed',
    delivered: 'delivered',
    open: 'opened',
    click: 'clicked'
  };

  const { userId, quoteId, templateId, event, timestamp } = tracking;

  const user = await User.query().findById(userId);
  const emailTemplate = await EmailTemplate.query().findById(templateId);

  await Quote.relatedQuery('events')
    .for(quoteId)
    .insert({
      userId: user.id,
      description: `An email (template name: ${emailTemplate.name}) sent by ${user.firstName} ${user.lastName} ${emailActionTexts[event] || event}`,
      eventDate: getDateTimeStringFromTimestamp(timestamp)
    });
};

const loggers = {
  [EVENT_TYPES.createQuote]: logCreateQuote,
  [EVENT_TYPES.updateQuote]: logUpdateQuote,
  [EVENT_TYPES.updateQuoteNotes]: logUpdateQuoteNotes,
  [EVENT_TYPES.addQuoteNote]: logAddQuoteNote,
  [EVENT_TYPES.updateQuoteNote]: logUpdateQuoteNote,
  [EVENT_TYPES.deleteQuoteNote]: logDeleteQuoteNote,
  [EVENT_TYPES.setFollowup]: logSetFollowups,
  [EVENT_TYPES.duplicateQuote]: logDuplicateQuote,
  [EVENT_TYPES.trackEmail]: logTrackEmail
};

export const logEvent = (eventType, ...args) => loggers[eventType](...args);
