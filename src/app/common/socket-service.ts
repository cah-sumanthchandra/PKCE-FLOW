import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ComponentService} from './component-service';
import {IdbService} from './idb-service';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    private socketUrl = environment.socketUrl;
    private stompClient;

    constructor(private componentService: ComponentService,
                private idbService: IdbService) {
        this.initializeWebSocketConnection();
    }

    initializeWebSocketConnection() {
        let ws = new SockJS(this.socketUrl);
        this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.debug = null;
        this.stompClient.connect({}, frame => {
            that.stompClient.subscribe('/user/utilities/reply', (message) => {
                if(message.body) {
                    this.componentService.updateReportCount();
                    let returnedData = JSON.parse(message.body);
                    this.idbService.addUsers(returnedData).then();
                }
            });
        }, this.errorCallBack.bind(this));
    }

    errorCallBack(error) {
        let that = this;
        console.log('errorCallBack -> ' + error);
        setTimeout(() => {
            console.log(this);
            that.initializeWebSocketConnection();
        }, 5000);
    }

    retrieveUsers(org: string, appId: string) {
        this.stompClient.send('/app/org/' + org + '/apps/' + appId + '/users');
    }

    retrieveUserFactors(org: string) {
        this.stompClient.send('/app/org/' + org + '/factors');
    }
}