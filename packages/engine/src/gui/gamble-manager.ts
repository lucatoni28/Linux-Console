import { tr } from "@miu2d/shared/lib/game-i18n";
/**
 * GambleManager - 骰子赌博小游戏（6 骰子）
 * 含随机加倍/惩罚、随机事件、特殊牌型，100+ 搞笑台词
 */

export type BetChoice = "big" | "small" | "odd" | "even" | "fourKind" | "threePairs" | "sextuple";

export interface DiceResult {
  dice: number[];
  sum: number;
  win: boolean;
  betAmount: number;
  netGain: number;
  randomBonus: number;
  randomPenalty: number;
  bonusText: string | null;    // 随机加倍台词
  penaltyText: string | null;  // 随机惩罚台词
  specialEvent: string | null;
  comboBonus: string | null;
  comboBonusAmount: number;
}

// ============= 100+ 搞笑台词 =============

const WIN_TEXTS = [
  tr("财神爷路过，赏你一锭金！"),
  tr("赌神转世，运气爆棚！"),
  tr("老板娘看上你了，多给点！"),
  tr("骰子被你的王霸之气震慑！"),
  tr("天降横财，挡都挡不住！"),
  tr("月老牵线，你和银子有缘！"),
  tr("观音菩萨保佑，多赏几两！"),
  tr("灶王爷上天言好事，给你加薪！"),
  tr("龙王三太子偷偷帮你吹了口气！"),
  tr("土地公公暗中给你开了后门！"),
  tr("二郎神的哮天犬叼来了银子！"),
  tr("太白金星喝醉了，随手赏你的！"),
  tr("哪吒踩着风火轮给你送钱来了！"),
  tr("孙悟空偷蟠桃顺便帮你赢了一把！"),
  tr("猪八戒赌输了把银子押你头上了！"),
  tr("阎王爷说你阳寿未尽，赏你点钱花！"),
  tr("黑白无常打赌输了，银子归你！"),
  tr("牛头马面偷偷给你塞了红包！"),
  tr("判官笔一抖，多写了几个零！"),
  tr("孟婆汤里加了财运符！"),
  tr("轮回转世，上辈子你是赌圣！"),
  tr("前世积德，这辈子骰子听你的话！"),
  tr("你妈给你求的护身符显灵了！"),
  tr("隔壁老王偷偷帮你拜了财神！"),
  tr("算命先生说你今天走大运！"),
  tr("黄大仙附体，手气逆天！"),
  tr("狐狸精被你的帅气迷住了，送钱！"),
  tr("蛇精给你吐了颗转运珠！"),
  tr("树精老了眼花，把银子算多了！"),
  tr("山神爷今天心情好多赏了点！"),
  tr("河神问你掉的是金骰子还是银骰子？"),
  tr("城隍爷给你批了个上上签！"),
  tr("文昌帝君说你不光有才还有财！"),
  tr("关二爷义薄云天，赏你酒钱！"),
  tr("赵公明骑着黑虎给你送元宝！"),
  tr("利市仙官给你开了财运光！"),
  tr("招财童子抱着金蟾来找你了！"),
  tr("五路财神齐聚，今天你是主角！"),
  tr("福禄寿三星报喜，加钱加钱！"),
  tr("喜鹊枝头叫，好事要来到！"),
  tr("左眼跳财，今天准了！"),
  tr("出门踩到狗屎运了！"),
  tr("捡到一枚铜钱，以小博大！"),
  tr("今天穿了红内裤，运气挡不住！"),
  tr("早上吃了根油条，两个蛋！"),
  tr("踩到四叶草了，幸运加倍！"),
  tr("看到流星许了个愿，灵了！"),
  tr("骰子看你帅，自己翻了个面！"),
  tr("银子觉得你比老板可爱，投奔你了！"),
  tr("赌场里的风水轮流转到你了！"),
  tr("今天黄历写着：宜赌博，大吉！"),
  tr("你身上散发的荷尔蒙影响了骰子！"),
  tr("骰子六面都朝上，庄家懵了！"),
  tr("老板打瞌睡，多找了你一倍！"),
  tr("掌柜的算盘珠子崩了，算多了！"),
  tr("账房先生老花眼，数字看错了！"),
  tr("老板娘心情好多退了点！"),
  tr("伙计手一抖，钱袋子翻了！"),
  tr("小二上错了菜，赔你的！"),
  tr("隔壁桌的酒洒你身上了，赔钱！"),
  tr("房梁上的老鼠打翻了钱罐子！"),
  tr("一只喜鹊叼来了银子！"),
  tr("乌鸦嘴今天说了好话！"),
  tr("黄鼠狼给鸡拜年，顺便送你钱！"),
  tr("兔子蹬鹰，歪打正着！"),
  tr("瞎猫碰上死耗子，赢了！"),
  tr("天上掉馅饼，正好砸你头上！"),
  tr("出门遇贵人，贵人请你赌一把！"),
  tr("朋友借你的人品用了一下！"),
  tr("你的RP今天爆发了！"),
  tr("系统检测到你是天选之人！"),
  tr("命运之轮转到了金色区域！"),
  tr("宇宙的能量汇聚在你手上！"),
  tr("量子力学说你必然会赢！"),
  tr("薛定谔的骰子，开出来是赢！"),
  tr("蝴蝶效应：一只蝴蝶帮你扇了一下！"),
  tr("暗物质在帮你推骰子！"),
  tr("你触发了隐藏成就：运气之王！"),
  tr("游戏管理员偷偷给你开了挂！"),
  tr("程序员在代码里埋了彩蛋给你！"),
  tr("服务器抽风了，多吐了点钱！"),
  tr("数据库溢出，银子溢到你兜里了！"),
  tr("网线被老鼠咬了，数据多传了一倍！"),
  tr("光纤里跑太快，银子多带了几两！"),
  tr("CPU过热算错了，你赚了！"),
  tr("内存泄漏，银子漏到你账上了！"),
  tr("这把不算，老板请你再来一把！"),
  tr("隔壁桌的大哥看不下去了，赏你的！"),
  tr("围观群众众筹给你的小费！"),
  tr("赌场做活动，你是幸运顾客！"),
  tr("开业大酬宾，多送一倍！"),
  tr("老板说今天薄利多销！"),
  tr("掌柜的说你是回头客，打折！"),
  tr("VIP会员专属加成！"),
  tr("你集齐了七颗龙珠，召唤了神龙！"),
  tr("神龙实现愿望：再来一倍！"),
  tr("你打开了潘多拉的盒子，里面是银子！"),
  tr("阿拉丁神灯：第三个愿望是加钱！"),
  tr("魔法少女变身成功，附赠财运！"),
  tr("你吃了恶魔果实，赌赌果实能力者！"),
  tr("鸣人的影分身帮你摇了骰子！"),
  tr("路飞的橡皮手多伸了一下！"),
  tr("柯南推理出骰子会倒向你这边！"),
  tr("小当家发光料理吃多了，手气发光！"),
];

const LOSE_TEXTS = [
  tr("恶鬼降临，骰子叛变了！"),
  tr("老板娘发威，加倍罚款！"),
  tr("厉鬼索命，银两飞了！"),
  tr("黑白无常来收账了！"),
  tr("阎王爷说你该交保护费了！"),
  tr("判官笔一划，银子没了！"),
  tr("孟婆汤喝多了，算错了注！"),
  tr("牛头马面把你的银子牵走了！"),
  tr("夜叉鬼从地底钻出来抢钱了！"),
  tr("饿鬼道的鬼魂闻到银子味了！"),
  tr("僵尸王在骰子上做了手脚！"),
  tr("吸血鬼伯爵吸走了你的财运！"),
  tr("狼人月圆之夜变身，顺走了银子！"),
  tr("木乃伊复活了，裹走了你的钱！"),
  tr("弗兰肯斯坦的怪物不高兴了！"),
  tr("贞子从骰子里爬出来了！"),
  tr("伽椰子在你背后！回头看看？"),
  tr("楚人美唱着粤剧来收账了！"),
  tr("笔仙在骰子上画了个叉！"),
  tr("碟仙说你今天不宜赌博！"),
  tr("水鬼在骰子里灌了水！"),
  tr("吊死鬼把你的银子吊走了！"),
  tr("饿死鬼把你的钱袋吃空了！"),
  tr("穷神附体，越赌越穷！"),
  tr("扫把星今天盯上你了！"),
  tr("太岁头上动土，出事了！"),
  tr("冲撞了煞星，破财消灾！"),
  tr("犯太岁了，诸事不顺！"),
  tr("本命年没穿红内裤！"),
  tr("左眼跳灾，今天应验了！"),
  tr("出门踩到香蕉皮了！"),
  tr("乌鸦在你头上拉了屎！"),
  tr("踩到猫尾巴了，猫诅咒你！"),
  tr("打翻了醋坛子，酸死了！"),
  tr("今天不宜出行，更不宜赌博！"),
  tr("黄历写着：忌赌博，破财！"),
  tr("你的星座今天水逆！"),
  tr("塔罗牌抽到了倒吊人！"),
  tr("算命先生说你今天破财！"),
  tr("风水先生说这个位置漏财！"),
  tr("骰子觉得你太嚣张了！"),
  tr("银子觉得老板更帅，回去了！"),
  tr("赌场的风水对你不利！"),
  tr("今天穿了绿帽子，运气差！"),
  tr("出门摔了一跤，运气也摔没了！"),
  tr("打了个喷嚏，运气跟着飞了！"),
  tr("放了个屁，把银子崩飞了！"),
  tr("流年不利，命犯小人！"),
  tr("今天是十三号星期五！"),
  tr("你触发了隐藏成就：倒霉蛋！"),
  tr("命运之轮转到了黑色区域！"),
  tr("暗能量在吞噬你的银子！"),
  tr("量子隧穿效应，银子穿墙跑了！"),
  tr("薛定谔的骰子，开出来是输！"),
  tr("熵增定律：你的运气在减少！"),
  tr("你掉进了概率的陷阱！"),
  tr("墨菲定律：会输的一定会输！"),
  tr("蝴蝶效应：一只蝴蝶帮倒忙！"),
  tr("混沌理论说你今天该输！"),
  tr("程序员写的bug被你触发了！"),
  tr("服务器抽风了，少吐了钱！"),
  tr("数据库主键冲突，银子回滚了！"),
  tr("网速太慢，银子在半路丢了！"),
  tr("光纤被挖断了，数据丢失！"),
  tr("CPU过热算错了，你亏了！"),
  tr("内存溢出，银子溢没了！"),
  tr("老板看你顺眼多收了点！"),
  tr("掌柜的算盘打得噼里啪啦！"),
  tr("账房先生今天精神不错算得清！"),
  tr("伙计手稳，一分没多给！"),
  tr("小二说概不赊账！"),
  tr("隔壁桌的大哥笑出了声！"),
  tr("围观群众纷纷摇头！"),
  tr("赌场的风水大师在做法！"),
  tr("你踩到了赌场的风水阵！"),
  tr("骰子里灌了铅，不过不是你的铅！"),
  tr("庄家出千了，可惜你没证据！"),
  tr("荷官手速太快你没看清！"),
  tr("赌场的猫头鹰盯着你看！"),
  tr("乌鸦嘴说你今天必输！"),
  tr("今天出门方向不对！"),
  tr("星座运势显示不宜赌博！"),
  tr("水星逆行影响了你的判断！"),
  tr("你被幸运女神抛弃了！"),
  tr("衰神今天特别关照你！"),
  tr("你的RP余额不足！"),
  tr("系统检测到你是非酋本酋！"),
  tr("游戏管理员看你不顺眼！"),
  tr("程序员在代码里埋了地雷给你！"),
  tr("这把不算，老板让你再来一把！"),
  tr("隔壁桌大妈的杀气影响了骰子！"),
  tr("你身后站着一个红衣女鬼！"),
  tr("镜子里的你在朝你笑！"),
  tr("午夜十二点的钟声响了！"),
  tr("骰子说它今天不想帮你！"),
];

// ============= Random Event Texts =============

const EVENT_TEXTS = {
  godOfWealth: tr("🧧 财神降临！白送一注！"),
  dealerShake: tr("😰 庄家手抖了！赔率翻倍！"),
  turnLuck: tr("🍀 时来运转！化险为夷！"),
  disaster: tr("💀 天降横祸！煮熟的鸭子飞了！"),
  charityChild: tr("👼 散财童子来啦！退还一半！"),
};

// ============= Utils =============

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// ============= Manager =============

export class GambleManager {
  private _isOpen = false;
  private _betAmount = 0;
  private _initialMoney = 0;
  private playerRef: { money: number } | null = null;
  private gambleVersion = 0;
  private onShowMessage: ((msg: string) => void) | null = null;
  private onUpdateView: (() => void) | null = null;

  setCallbacks(callbacks: { onShowMessage?: (msg: string) => void; onUpdateView?: () => void }) {
    if (callbacks.onShowMessage) this.onShowMessage = callbacks.onShowMessage;
    if (callbacks.onUpdateView) this.onUpdateView = callbacks.onUpdateView;
  }

  isOpen(): boolean { return this._isOpen; }
  get betAmount(): number { return this._betAmount; }
  get initialMoney(): number { return this._initialMoney; }
  getState() { return { isOpen: this._isOpen, betAmount: this._betAmount }; }
  getVersion(): number { return this.gambleVersion; }

  startGamble(betAmount: number, player: { money: number }) {
    this._isOpen = true;
    this._betAmount = betAmount;
    this._initialMoney = player.money;
    this.playerRef = player;
    this.emitUpdate();
  }

  rollDice(choice: BetChoice, multiplier: number = 1): DiceResult | null {
    if (!this._isOpen || !this.playerRef) return null;

    const bet = this._betAmount * Math.max(1, Math.min(1000, multiplier));
    if (this.playerRef.money < bet) {
      this.onShowMessage?.(tr("银两不足！"));
      return null;
    }

    this.playerRef.money -= bet;

    const dice = Array.from({ length: 6 }, () => rand(1, 6));
    const sum = dice.reduce((a, b) => a + b, 0);

    const counts = new Map<number, number>();
    for (const d of dice) counts.set(d, (counts.get(d) ?? 0) + 1);
    const maxCount = Math.max(...counts.values());
    const pairCount = [...counts.values()].filter((c) => c === 2).length;
    const isThreePairs = pairCount === 3 && maxCount === 2;
    const isFourKind = maxCount >= 4;
    const isSextuple = maxCount >= 6;

    // 输赢判定
    let playerWins = false;
    let odds = 2;
    switch (choice) {
      case "big":        playerWins = !isFourKind && sum >= 21; odds = 2; break;
      case "small":      playerWins = !isFourKind && sum <= 20; odds = 2; break;
      case "odd":        playerWins = !isFourKind && sum % 2 === 1; odds = 2; break;
      case "even":       playerWins = !isFourKind && sum % 2 === 0; odds = 2; break;
      case "fourKind":   playerWins = isFourKind; odds = 10; break;
      case "threePairs": playerWins = isThreePairs; odds = 25; break;
      case "sextuple":   playerWins = isSextuple; odds = 100; break;
    }

    // 随机事件（~6%）
    let specialEvent: string | null = null;
    const eventRoll = Math.random();
    if (eventRoll < 0.02) {
      specialEvent = EVENT_TEXTS.godOfWealth;
      this.playerRef.money += bet;
    } else if (eventRoll < 0.035) {
      specialEvent = EVENT_TEXTS.dealerShake;
      odds *= 2;
    } else if (eventRoll < 0.045) {
      if (!playerWins) { specialEvent = EVENT_TEXTS.turnLuck; playerWins = true; }
    } else if (eventRoll < 0.055) {
      if (playerWins) { specialEvent = EVENT_TEXTS.disaster; playerWins = false; }
    } else if (eventRoll < 0.065) {
      specialEvent = EVENT_TEXTS.charityChild;
      this.playerRef.money += Math.floor(bet / 2);
    }

    // 计算收益
    let netGain: number;
    let randomBonus = 1;
    let randomPenalty = 1;
    let bonusText: string | null = null;
    let penaltyText: string | null = null;

    if (playerWins) {
      const bonusRoll = Math.random();
      if (bonusRoll < 0.08) { randomBonus = 5; }
      else if (bonusRoll < 0.15) { randomBonus = 3; }
      else if (bonusRoll < 0.25) { randomBonus = 2; }
      else if (bonusRoll < 0.4) { randomBonus = 1.5; }

      if (randomBonus > 1) bonusText = pick(WIN_TEXTS);
      const totalWin = Math.floor(bet * odds * randomBonus);
      this.playerRef.money += totalWin;
      netGain = totalWin - bet;
    } else {
      const penaltyRoll = Math.random();
      if (penaltyRoll < 0.05) { randomPenalty = 3; }
      else if (penaltyRoll < 0.1) { randomPenalty = 2; }
      else if (penaltyRoll < 0.2) { randomPenalty = 1.5; }

      if (randomPenalty > 1) penaltyText = pick(LOSE_TEXTS);
      const extraLoss = Math.floor(bet * (randomPenalty - 1));
      if (extraLoss > 0 && this.playerRef.money >= extraLoss) {
        this.playerRef.money -= extraLoss;
      } else if (extraLoss > 0) {
        // 钱不够就扣光
        this.playerRef.money = Math.max(0, this.playerRef.money);
      }
      netGain = -(bet + extraLoss);
    }

    // 特殊牌型奖励
    let comboBonus: string | null = null;
    let comboBonusAmount = 0;
    if (playerWins) {
      const sorted = [...dice].sort().join(",");
      const isStraight = sorted === "1,2,3,4,5,6";
      const allOdd = dice.every((d) => d % 2 === 1);
      const allEven = dice.every((d) => d % 2 === 0);
      const allHigh = dice.every((d) => d >= 4);
      const allLow = dice.every((d) => d <= 3);

      if (isStraight) {
        comboBonus = tr("📏 顺子！额外奖励！");
        comboBonusAmount = bet * 2;
      } else if (allOdd) {
        comboBonus = tr("🌑 全奇！额外奖励！");
        comboBonusAmount = bet;
      } else if (allEven) {
        comboBonus = tr("☀ 全偶！额外奖励！");
        comboBonusAmount = bet;
      } else if (allHigh && maxCount < 4) {
        comboBonus = tr("⬆ 全大！额外奖励！");
        comboBonusAmount = Math.floor(bet * 0.5);
      } else if (allLow && maxCount < 4) {
        comboBonus = tr("⬇ 全小！额外奖励！");
        comboBonusAmount = Math.floor(bet * 0.5);
      }

      if (comboBonusAmount > 0) {
        this.playerRef.money += comboBonusAmount;
        netGain += comboBonusAmount;
      }
    }

    this.emitUpdate();
    return { dice, sum, win: playerWins, betAmount: bet, netGain, randomBonus, randomPenalty, bonusText, penaltyText, specialEvent, comboBonus, comboBonusAmount };
  }

  endGamble() {
    if (!this._isOpen) return;
    this._isOpen = false;
    this.playerRef = null;
    this.emitUpdate();
  }

  hasEnoughMoney(): boolean {
    if (!this.playerRef) return false;
    return this.playerRef.money >= this._betAmount;
  }

  private emitUpdate() {
    this.gambleVersion++;
    this.onUpdateView?.();
  }
}
