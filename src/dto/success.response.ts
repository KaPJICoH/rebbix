import { AppResponse } from './app-response';

export class SuccessResponse<Data> implements AppResponse<Data> {
  data: Data;
  result = true;

  constructor(data: Data) {
    this.data = data;
  }
}
