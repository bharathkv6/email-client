import HttpClient from './app/http-client';
import Renderer from './app/renderer';
import './index.css';

const loadApp = async () => {
  const httpClient = new HttpClient();
  const renderer = new Renderer();

  const emailList = await httpClient.fetchEmailList();
  renderer.setState(emailList);
}

loadApp();