export const GAME_EVENTS = {

    NEXT_DRAW_TIMESTAMP: { key: "next_draw_timestamp", clear:true },
    LOGOUT_SUCCESS : { key: "logout_success", clear:true},
    LOGIN_SUCCESS : { key: "login_success", clear: true},
    LIFETIME_LOGIN_SUCCESS : {key: "lifetime_login_success", clear: true},
    ON_BALANCE_UPDATED: { key: "on_balance_updated", clear: true},
    ON_VALUE_UPDATED: { key: "on_value_updated", clear: true},
    ON_RESULTLIST_UPDATED: { key: "on_resultlist_updated", clear: true},
    ON_UPDATE_TOKEN : {key: "on_update_token", clear: true},
    ON_BUY_COMPLETE : {key: "on_buy_complete", clear: true},
    ON_BARCODELIST_UPDATED : {key: "on_barcodelist_updated", clear: true},
    ON_REPORT_GENERATED: { key: "on_report_generated", clear: true },
    FETCH_RESULT: { key: "fetch_result", clear: true },
    FETCH_NEXT_DRAWTIME: { key: "fetch_next_drawtime", clear: true },
    FETCH_RESULT_LIST: { key: 'fetch_result_list', clear: true },
    ON_CONNECTION_LOST: { key: 'on_connection_lost', clear: true}
}

type gameEvent = { key: string; clear: boolean};

export default class GameEventEmitter extends Phaser.Events.EventEmitter{
    private static instance : GameEventEmitter;

    private constructor() {
        super();
    }

    public static GetInstance() : GameEventEmitter
    {
        if(!GameEventEmitter.instance)
        {
            GameEventEmitter.instance = new GameEventEmitter();
        }
        return GameEventEmitter.instance;
    }

    clearEvents()
    {
        for(let eventName in GAME_EVENTS)
        {
            const event = GAME_EVENTS[eventName] as gameEvent;
            if(event.clear)
            {
                this.removeAllListeners(event.key);
            }
        }
    }
}