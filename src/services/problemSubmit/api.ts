// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** doQuestionSubmit POST /api/question_submit/ */
export async function doProblemSubmit(
  body: API.QuestionSubmitAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.R>('/api/question_submit/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listPostByPage POST /api/question_submit/list/page */
export async function listProblemSubmitVoByPage(
  body: API.QuestionSubmitQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.R>('/api/question_submit/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取某次提交的详细信息 GET */
export async function getProblemSubmitVoById (
  id: number,
  options?: { [key: string]: any }
) {
  return request<API.R>(`/oj/problem_submit/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
