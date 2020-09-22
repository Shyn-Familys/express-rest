import mongoose from 'mongoose';
import logger from '../providers/logger';

const MongoDB = {
  connect: async (mongoURL: string): Promise<void> => {
    try {
      const conn = await mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger({
        type: 'Success',
        message: `MongoDB connected: ${conn.connection.host}`,
      });
    } catch (err) {
      logger({
        type: 'Error',
        message: `Fail to connect to mongo ${err}`,
      });
      process.exit();
    }
  },
};

export default MongoDB;
