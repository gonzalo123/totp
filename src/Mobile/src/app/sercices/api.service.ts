import { Injectable } from '@angular/core'
import { isDevMode } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { CONF } from './conf'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private isDev: boolean = isDevMode()
  private apiUrl: string

  constructor (private http: HttpClient) {
    this.apiUrl = this.isDev ? CONF.API_DEV : CONF.API_PROD
  }

  public get (uri: string, params?: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + uri, {
        headers: ApiService.getHeaders(),
        params: ApiService.getParams(params)
      }).subscribe(
        res => {this.handleHttpNext(res), resolve(res)},
        err => {this.handleHttpError(err), reject(err)},
        () => this.handleHttpComplete()
      )
    })
  }

  private static getHeaders (): HttpHeaders {

    const headers = {
      'Content-Type': 'application/json'
    }

    headers['Authorization'] = 'Bearer ' + CONF.bearer

    return new HttpHeaders(headers)
  }

  private static getParams (params?: Object): HttpParams {
    let Params = new HttpParams()
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        Params = Params.set(key, params[key])
      }
    }

    return Params
  }

  private handleHttpError (err) {
    console.log('HTTP Error', err)
  }

  private handleHttpNext (res) {
    console.log('HTTP response', res)
  }

  private handleHttpComplete () {
    console.log('HTTP request completed.')
  }
}
