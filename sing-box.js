const { type , name } = $arguments;

const compatibleOutbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
};

let isCompatibleAdded = false; // 用于检查是否已添加兼容配置
let config = JSON.parse($files[0]); // 解析文件内容为 JSON 对象

// 生成代理
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
});

// 将生成的代理添加到出站配置中
config.outbounds.push(...proxies);

// 定义标签和对应的正则表达式映射
const tagRegexMap = {
  所有: /.*/, // 匹配所有
  '所有-自动': /.*/, // 匹配所有
  '自建': /自建/i, // 匹配包含“自建”的标签
  '自建-自动': /自建/i, // 匹配包含“自建”的标签
  '香港': /^(?!.*自建).*?(港|hk|hongkong|kong kong|🇭🇰)/i, // 匹配“香港”但不匹配“自建”
  '香港-自动': /^(?!.*自建).*?(港|hk|hongkong|kong kong|🇭🇰)/i, // 修改为与“香港”相同的正则表达式
  '台湾': /^(?!.*自建).*?(台|tw|taiwan|🇹🇼)/i, // 匹配“台湾”但不匹配“自建”
  '台湾-自动': /^(?!.*自建).*?(台|tw|taiwan|🇹🇼)/i, // 修改为与“台湾”相同的正则表达式
  '日本': /^(?!.*自建).*?(日本|jp|japan|🇯🇵)/i, // 匹配“日本”但不匹配“自建”
  '日本-自动': /^(?!.*自建).*?(日本|jp|japan|🇯🇵)/i, // 修改为与“日本”相同的正则表达式
  '新加坡': /^(?!.*自建).*?(新|sg|singapore|🇸🇬)/i, // 匹配“新加坡”但不匹配“自建”
  '新加坡-自动': /^(?!.*自建).*?(新|sg|singapore|🇸🇬)/i, // 修改为与“新加坡”相同的正则表达式
  '美国': /^(?!.*自建).*?(美|us|unitedstates|united states|🇺🇸)/i, // 匹配“美国”但不匹配“自建”
  '美国-自动': /^(?!.*自建).*?(美|us|unitedstates|united states|🇺🇸)/i, // 修改为与“美国”相同的正则表达式
  '韩国': /^(?!.*自建).*?(韩|kr|korea|🇰🇷)/i, // 匹配“韩国”但不匹配“自建”
  '韩国-自动': /^(?!.*自建).*?(韩|kr|korea|🇰🇷)/i, // 修改为与“韩国”相同的正则表达式
  '巴西': /^(?!.*自建).*?(巴|br|brazil|🇧🇷)/i, // 匹配“巴西”但不匹配“自建”
  '巴西-自动': /^(?!.*自建).*?(巴|br|brazil|🇧🇷)/i, // 修改为与“巴西”相同的正则表达式
  '波兰': /^(?!.*自建).*?(波|pl|poland|🇵🇱)/i, // 匹配“波兰”但不匹配“自建”
  '波兰-自动': /^(?!.*自建).*?(波|pl|poland|🇵🇱)/i, // 修改为与“波兰”相同的正则表达式
  '喀麦隆': /^(?!.*自建).*?(喀|cm|cameroon|🇨🇲)/i, // 匹配“喀麦隆”但不匹配“自建”
  '喀麦隆-自动': /^(?!.*自建).*?(喀|cm|cameroon|🇨🇲)/i, // 修改为与“喀麦隆”相同的正则表达式
  '中非共和国': /^(?!.*自建).*?(中非|cf|centralafrican|🇨🇫)/i, // 匹配“中非”但不匹配“自建”
  '中非共和国-自动': /^(?!.*自建).*?(中非|cf|centralafrican|🇨🇫)/i, // 修改为与“中非共和国”相同的正则表达式
  '哈萨克斯坦': /^(?!.*自建).*?(哈|kz|kazakhstan|🇰🇿)/i, // 匹配“哈萨克斯坦”但不匹配“自建”
  '哈萨克斯坦-自动': /^(?!.*自建).*?(哈|kz|kazakhstan|🇰🇿)/i, // 修改为与“哈萨克斯坦”相同的正则表达式
  '俄罗斯': /^(?!.*自建).*?(俄|ru|russia|🇷🇺)/i, // 匹配“俄罗斯”但不匹配“自建”
  '俄罗斯-自动': /^(?!.*自建).*?(俄|ru|russia|🇷🇺)/i, // 修改为与“俄罗斯”相同的正则表达式
  '英国': /^(?!.*自建).*?(英|uk|unitedkingdom|🇬🇧)/i, // 匹配“英国”但不匹配“自建”
  '英国-自动': /^(?!.*自建).*?(英|uk|unitedkingdom|🇬🇧)/i, // 修改为与“英国”相同的正则表达式
  '瑞典': /^(?!.*自建).*?(瑞|se|sweden|🇸🇪)/i, // 匹配“瑞典”但不匹配“自建”
  '瑞典-自动': /^(?!.*自建).*?(瑞|se|sweden|🇸🇪)/i, // 修改为与“瑞典”相同的正则表达式
  '法国': /^(?!.*自建).*?(法|fr|france|🇫🇷)/i, // 匹配“法国”但不匹配“自建”
  '法国-自动': /^(?!.*自建).*?(法|fr|france|🇫🇷)/i, // 修改为与“法国”相同的正则表达式
  '荷兰': /^(?!.*自建).*?(荷|nl|netherlands|🇳🇱)/i, // 匹配“荷兰”但不匹配“自建”
  '荷兰-自动': /^(?!.*自建).*?(荷|nl|netherlands|🇳🇱)/i, // 修改为与“荷兰”相同的正则表达式
  '加拿大': /^(?!.*自建).*?(加|ca|canada|🇨🇦)/i, // 匹配“加拿大”但不匹配“自建”
  '加拿大-自动': /^(?!.*自建).*?(加ca|canada|🇨🇦)/i, // 修改为与“加拿大”相同的正则表达式
  '澳大利亚': /^(?!.*自建).*?(澳|au|australia|🇦🇺)/i, // 匹配“澳大利亚”但不匹配“自建”
  '澳大利亚-自动': /^(?!.*自建).*?(澳|au|australia|🇦🇺)/i, // 修改为与“澳大利亚”相同的正则表达式
  '印度': /^(?!.*自建).*?(印|in|india|🇮🇳)/i, // 匹配“印度”但不匹配“自建”
  '印度-自动': /^(?!.*自建).*?(印|in|india|🇮🇳)/i, // 修改为与“印度”相同的正则表达式
  '阿联酋': /^(?!.*自建).*?(阿|ae|uae|🇦🇪)/i, // 匹配“阿联酋”但不匹配“自建”
  '阿联酋-自动': /^(?!.*自建).*?(阿|ae|uae|🇦🇪)/i, // 修改为与“阿联酋”相同的正则表达式
  '德国': /^(?!.*自建).*?(德|de|germany|🇩🇪)/i, // 匹配“德国”但不匹配“自建”
  '德国-自动': /^(?!.*自建).*?(德|de|germany|🇩🇪)/i, // 修改为与“德国”相同的正则表达式
};

// 遍历出站配置并添加相应的代理
config.outbounds.forEach(outbound => {
  const regex = tagRegexMap[outbound.tag];

  if (regex) {
    // 添加匹配的代理
    outbound.outbounds.push(...getTags(proxies, regex));
  }
});

// 确保每个出站配置都有代理
config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!isCompatibleAdded) {
      config.outbounds.push(compatibleOutbound);
      isCompatibleAdded = true;
    }
    outbound.outbounds.push(compatibleOutbound.tag);
  }
});

// 将最终的配置转换为 JSON 字符串
$content = JSON.stringify(config, null, 2);

// 获取标签的函数
function getTags(proxies, regex) {
  return proxies.filter(p => regex.test(p.tag)).map(p => p.tag);
}
