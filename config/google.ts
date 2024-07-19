import { registerAs } from '@nestjs/config';

export default registerAs('google', () => {
  return {
    key: process.env.GOOGLE_KEY || 'GOOGLE_KEY',
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirect_uris: process.env.GOOGLE_REDIRECT_URIS || '',
    accaciaBillReaderEmail: process.env.ACCACIA_BILL_READER_EMAIL || '',
  };
});
