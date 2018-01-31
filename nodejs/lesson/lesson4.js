const url = require('url')
const superagent = require('superagent')
const cheerio = require('cheerio')
const eventproxy = require('eventproxy')
const cnodeUrl = 'https://cnodejs.org/'
superagent.get(cnodeUrl)
  .end((err, res) => {
    if (err) {
      return console.error(err)
    }
    let topicUrl = []
    let $ = cheerio.load(res.text)
    $('#topic_list .topic_title').each((idx, element) => {
      let $element = $(element)
      // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
      // 我们用 url.resolve 来自动推断出完整 url，变成
      // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
      // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
      var href = url.resolve(cnodeUrl, $element.attr('href'));
      topicUrl.push(href)
    })
    console.log(topicUrl)
  })
