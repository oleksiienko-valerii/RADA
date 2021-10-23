import 'jest-extended';
import axios from 'axios';
import { USER_PATH } from '../constants/constants';
import { validate } from '../schema_validator/index';

import postUser from '../json/postUser.json';

describe('Testing public API', () => {
  beforeAll(async () => {});

  test('Check GET status all users', async () => {
    const getAllUsers = await axios.get(USER_PATH.GET_USERS_FROM_PAGE);
    const allUsersResponse = getAllUsers.data;
  });

  test('Check GET Single user by ID from page', async () => {
    const getAllUser = await axios.get(USER_PATH.GET_USERS_FROM_PAGE + `?page=1`);
    const allUsersResponse = getAllUser.data;

    const getResponse = await axios.get(USER_PATH.GET_USER + allUsersResponse.data[0].id);
    const userResponse = getResponse.data;

    expect(getResponse.status).toEqual(200);
    expect(userResponse.data.id).toEqual(allUsersResponse.data[0].id);
  });

  test('Check create user', async () => {
    postUser.job = 'job_' + Date.now();
    postUser.name = 'name_' + Date.now();

    const postResponse = await axios.post(USER_PATH.CREATE_USER, postUser);
    const userRespose = postResponse.data;
    expect(validate(userRespose), 'Schema should be true and validated').toBeTruthy();

    expect(postResponse.status, 'Response should be 201').toEqual(201);
    expect(postResponse.data.job).toEqual(userRespose.job);
    expect(postResponse.data.name).toEqual(userRespose.name);
  });

  test('Check user ID after creation', async () => {
    postUser.job = 'My job is_' + Date.now();
    postUser.name = 'My name is_' + Date.now();

    const postResponse = await axios.post(USER_PATH.CREATE_USER, postUser);
    const userRespose = postResponse.data;

    expect(postResponse.status, 'Response should be 201').toEqual(201);

    const getCreatedUser = await axios.get(USER_PATH.GET_USER + userRespose.id);
    expect(getCreatedUser.status, 'Response should be 200').toEqual(200);
  });

  test('Check delete user from DB', async () => {
    const getAllUser = await axios.get(USER_PATH.GET_USERS_FROM_PAGE + `?page=1`);
    const allUsersResponse = getAllUser.data;

    const getResponse = await axios.get(USER_PATH.GET_USER + allUsersResponse.data[0].id);
    const userResponse = getResponse.data;

    expect((await axios.delete(USER_PATH.DETETE_USER + userResponse.id)).status, 'Status should be 204').toEqual(204);
  });

  test('Check delete user after creation', async () => {
    postUser.job = 'job_' + Date.now();
    postUser.name = 'name_' + Date.now();

    const postResponse = await axios.post(USER_PATH.CREATE_USER, postUser);
    const userRespose = postResponse.data;

    expect((await axios.delete(USER_PATH.DETETE_USER + userRespose.id)).status, 'Status should be 204').toEqual(204);
  });
});
