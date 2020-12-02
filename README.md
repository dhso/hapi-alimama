# hapi-alimama
A Hapi plugin for alimama sdk

# install
```
npm install github:dhso/hapi-alimama
```

# options
```
appkey: 'your appkey, required',
appsecret: 'your appsecret, required',
url: 'http://gw.api.taobao.com/router/rest, optional',
spid: 'your spid, optional',
zpid: 'your zpid, optional',
adzoneid: 'your adzoneid, optional',
siteid: 'your siteid, optional'
```

# example
```
/*
聚划算商品搜索接口
http://open.taobao.com/docs/api.htm?spm=a219a.7395905.0.0.fU8Hl3&scopeId=11655&apiId=28762
*/
let taobao_ju_items_search = {
    method: ['GET'],
    path: '/taobao/ju/items/search',
    handler: async(req, h) => {
        try {
            const res = await h.alimamaExecute('taobao.ju.items.search', {
                'param_top_item_query': Object.assign({},
                    req.query
                )
            });
            return {
                code: 200,
                data: res
            }
        } catch (err) {
            return h.response(Object.assign({ name: err.name, message: err.message }, err)).code(500);
        }
    }
};

/*
获取淘宝联盟选品库的宝贝信息
http://open.taobao.com/docs/api.htm?spm=a219a.7395905.0.0.ZiPlLT&scopeId=11655&apiId=26619
*/
let taobao_tbk_uatm_favorites_item_get = {
    method: ['GET'],
    path: '/taobao/tbk/uatm/favorites/item/get',
    handler: async(req, h) => {
        try {
            if (configs.alimama.adzoneid == null) throw new Error('缺少配置 alimama.adzoneid.');
            if (req.query.favorites_id == null) throw new Error('缺少参数 favorites_id.');
            const res = await h.alimamaExecute('taobao.tbk.uatm.favorites.item.get', Object.assign({
                'fields': 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick,shop_title,zk_final_price_wap,event_start_time,event_end_time,tk_rate,status,type',
                'adzone_id': configs.alimama.adzoneid,
                'platform': 2
            }, req.query));
            return {
                code: 200,
                data: res
            }
        } catch (err) {
            return h.response(Object.assign({ name: err.name, message: err.message }, err)).code(500);
        }
    }
};

```