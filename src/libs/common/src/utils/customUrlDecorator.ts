import {
  applyDecorators,
  Get as NestGet,
  Post as NestPost,
  Patch as NestPatch,
  Delete as NestDelete,
  Put as NestPut,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

export function Get(path = '') {
  const isProd = +process.env.IS_PROD;
  let data = [];
  if (!isProd) {
    data = getParamsFromPath(path);
  }
  return applyDecorators(
    NestGet(path),
    ...(!isProd ? data.map((d) => ApiParam({ name: d, type: 'string' })) : []),
  );
}
export function Patch(path = '') {
  let data = [];
  const isProd = +process.env.IS_PROD;
  if (!isProd) {
    data = getParamsFromPath(path);
  }
  return applyDecorators(
    NestPatch(path),
    ...(!isProd ? data.map((d) => ApiParam({ name: d, type: 'string' })) : []),
  );
}
export function Post(path = '') {
  let data = [];
  const isProd = +process.env.IS_PROD;
  if (!isProd) {
    data = getParamsFromPath(path);
  }
  return applyDecorators(
    NestPost(path),
    ...(!isProd ? data.map((d) => ApiParam({ name: d, type: 'string' })) : []),
  );
}
export function Put(path = '') {
  let data = [];
  const isProd = +process.env.IS_PROD;
  if (!isProd) {
    data = getParamsFromPath(path);
  }
  return applyDecorators(
    NestPut(path),
    ...(!isProd ? data.map((d) => ApiParam({ name: d, type: 'string' })) : []),
  );
}
export function Delete(path = '') {
  let data = [];
  const isProd = +process.env.IS_PROD;
  if (!isProd) {
    data = getParamsFromPath(path);
  }
  return applyDecorators(
    NestDelete(path),
    ...(!isProd ? data.map((d) => ApiParam({ name: d, type: 'string' })) : []),
  );
}

const getParamsFromPath = (path?: string) => {
  const data = [];
  let currentVar = '';
  let isVar = false;
  // variable starts with :
  for (let i = 0; i < path.length; i++) {
    if (path[i] === ':') {
      isVar = true;
      currentVar = '';
    } else if (path[i] === '/') {
      if (isVar) {
        data.push(`${currentVar}`);
      }
      isVar = false;
    } else {
      if (isVar) {
        currentVar += path[i];
      }
    }
    if (i === path.length - 1 && isVar) {
      data.push(`${currentVar}`);
    }
  }
  return data;
};
