import addMonths from 'date-fns/addMonths';
import parseISO from 'date-fns/parseISO';
import formatDate from 'date-fns/format';
import { VehicleSize } from '@server/models';
import config from '@server/config';
import * as numberFormat from '@server/lib/number-format';
import * as Sendgrid from './sendgrid';

export const deleteListing = async (order) => {
  let text = '';

  text = `UID(${config.centralDispatch.uid})*`;
  text = `${text}DELETE(${order.id})*`;

  await Sendgrid.sendMail({
    to: config.centralDispatch.endpointEmail,
    from: config.centralDispatch.dispatchEmail,
    subject: 'Remove from load board',
    text
  });
};

export const postToLoadBoard = async (order) => {
  let text = '';

  text = `UID(${config.centralDispatch.uid})*`;
  text = `${text}DELETE(${order.id})*`;
  text = `${text}${order.id},`;
  text = `${text}${order.origin.city},`;
  text = `${text}${order.origin.state},`;
  text = `${text}${order.origin.zipcode},`;
  text = `${text}${order.destination.city},`;
  text = `${text}${order.destination.state},`;
  text = `${text}${order.destination.zipcode},`;
  const cod = numberFormat.priceFormat(
    order.transport.totalPrice - order.transport.deposit
  );
  text = `${text}${cod},`;
  text = `${text}${cod},`;
  text = `${text}cash/certified funds,`;
  text = `${text}delivery,`;
  text = `${text}none,`;
  text = `${text}${order.transport.carrierType.toLowerCase()},`;
  text = `${text}${order.vehicles.some((v) => !v.operable) ? 'inop' : 'operable'},`;

  const availableDate = formatDate(parseISO(order.transport.availableDate), 'yyyy-MM-dd');
  text = `${text}${availableDate},`;

  const displayUntil = formatDate(addMonths(new Date(), 3), 'yyyy-MM-dd');
  text = `${text}${displayUntil},`;
  text = `${text},`;

  const promises = order.vehicles.map((vehicle) => new Promise((resolve) => {
    VehicleSize.query().findById(vehicle.sizeId).then((size) => {
      resolve({
        ...vehicle,
        category: size.category
      });
    });
  }));
  const vehicles = await Promise.all(promises);
  vehicles.forEach((vehicle, index) => {
    text = `${text}${vehicle.year}|${vehicle.make}|${vehicle.model}|${vehicle.category}`;
    if (index < vehicles.length - 1) {
      text = `${text};`;
    }
  });

  text = `${text}*`;

  await Sendgrid.sendMail({
    to: config.centralDispatch.endpointEmail,
    from: config.centralDispatch.dispatchEmail,
    subject: 'Post to load board',
    text
  });
};
