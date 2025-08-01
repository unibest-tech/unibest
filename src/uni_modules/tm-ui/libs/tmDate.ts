export type tmDateTypeTime = 'y' | 'm' | 'd' | 'h' | 'M' | 's' | 'ms' | 'w'
export type tmDateTypeQuarter = {
	quarter: number,
	start: string,
	end: string
}

export type DateFormat = 'RFC2822' | 'ISO8601' | 'CUSTOM';
/**
 * 用来解析非标准时间以及各种奇怪的时间格式。
 */
export function createDate(dateStrs : string) : Date {
	const dateStr = dateStrs.replace(/\//g,'-')
	const result = new Date();
	
	// YYYY,YYYY-MM,YYYY-MM-DD,YYYY-MM-DD HH,YYYY-MM-DD HH:mm,YYYY-MM-DD HH:mm:ss
	let regxyy = /^(\d{4})$/
	let regxyymm = /^(\d{4})[-/](\d{1,2})$/
	let regxyymmdd = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
	let regxyymmddhh = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2}) (\d{1,2})$/
	let regxyymmddhhmm = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2}) (\d{1,2}):(\d{1,2})$/
	let regxyymmddhhmmss = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
	
	let year = result.getFullYear();
	let month = result.getMonth()-1
	let day = result.getDate()
	let hour = result.getHours()
	let minute = result.getMinutes()
	let second = result.getSeconds()
	
	
	result.setSeconds(59);
	result.setMinutes(59);
	result.setHours(59);
	result.setDate(1);
	
	if(regxyymmddhhmmss.test(dateStr)){
		const match = dateStr.match(regxyymmddhhmmss)!;
		year = (parseInt(match[1] as string));
		month = (parseInt(match[2] as string) - 1);
		day = (parseInt(match[3] as string));
		hour = (parseInt(match[4] as string));
		minute = (parseInt(match[5] as string));
		second = (parseInt(match[6] as string));
	}else if(regxyymmddhhmm.test(dateStr)){
		const match = dateStr.match(regxyymmddhhmm)!;
		year = (parseInt(match[1] as string));
		month = (parseInt(match[2] as string) - 1);
		day = (parseInt(match[3] as string));
		hour = (parseInt(match[4] as string));
		minute = (parseInt(match[5] as string));
	
	}else if(regxyymmddhh.test(dateStr)){
		const match = dateStr.match(regxyymmddhh)!;
		year = (parseInt(match[1] as string));
		month = (parseInt(match[2] as string) - 1);
		day = (parseInt(match[3] as string));
		hour = (parseInt(match[4] as string));
	}else if(regxyymmdd.test(dateStr)){
		const match = dateStr.match(regxyymmdd)!;
		year = (parseInt(match[1] as string));
		month = (parseInt(match[2] as string) - 1);
		day = (parseInt(match[3] as string));
		
		
	}else if(regxyymm.test(dateStr)){
		const match = dateStr.match(regxyymm)!;
		year = (parseInt(match[1] as string));
		month = (parseInt(match[2] as string) - 1);
	}else if(regxyy.test(dateStr)){
		const match = dateStr.match(regxyy)!;
		year = (parseInt(match[1] as string));
		
	}
	
	
	result.setSeconds(second);
	result.setMinutes(minute);
	result.setHours(hour);
	result.setFullYear(year);
	result.setMonth(month);
	result.setDate(day);
	return result;
}

export class tmDate {
	date: Date;
	constructor(dateStr: string | number | Date | null = null) {
		if (dateStr == null) {
			this.date = new Date();
			return;
		}
		if(typeof dateStr == 'number'){
			this.date = new Date(dateStr! as number);
		}else if(typeof dateStr == 'string'){
			if(dateStr == ''){
				this.date = new Date();
				return;
			}
			const dateformatStr = this.detectDateFormat(dateStr!)
			
			if(dateformatStr=='CUSTOM'){
				let str = dateStr! as string;
				str = str.replace(/-/g,'/')
				let isNumberStr = /^\d+$/.test(str)
			
				if(!isNumberStr){
					this.date = createDate(dateStr!)
						
				}else{
					this.date = new Date(parseInt(str!));
				}
				
			}else{
				this.date = new Date(dateStr! as string);
			}
			
			return;
		}else if(dateStr instanceof Date){
			this.date = dateStr! as Date;
			return;
		}
		
		this.date = new Date();
	}
	/**
	 * 检测字符串的日期格式类型
	 * @param dateStr - 日期字符串
	 * @returns 日期格式类型
	 */
	detectDateFormat(dateStr : string) : DateFormat {
		// RFC2822 格式检测
		if (/^(?:\w{3},\s)?(?:\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}\s\d{2}:\d{2}(?::\d{2})?(?:\sGMT)?)|(?:\w{3}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2}\s\d{2}:\d{2}(?::\d{2})?\s\d{4})/.test(dateStr)) {
			return 'RFC2822';
		}
	
		// ISO8601 格式检测
		if (/^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/.test(dateStr)) {
			return 'ISO8601';
		}
	
		return 'CUSTOM';
	}
	/**
	 * 给数字添加前缀0
	 */
	translateFullDate(d: number, w: number): string {
		let dstr = d.toString();
		if (dstr.length < w) {
			let dar: number[] = new Array(w - dstr.length).fill(0);
			dstr = dar.join('') + dstr
		}
		return dstr;
	}
	/**
	 * 格式化日期
	 * @param {string} s 模板，比如YYYY/MM/DD hh:mm:ss
	 * @returns {string} 格式化后的日期字符串
	 */
	format(s: string | null = null): string {
		let str = "YYYY/MM/DD hh:mm:ss"
		if (s != null) {
			str = s;
		}
		str = str.replace(/YYYY/g, this.translateFullDate(this.date.getFullYear(), 2))
		str = str.replace(/MM/g, this.translateFullDate(this.date.getMonth() + 1, 2))
		str = str.replace(/DD/g, this.translateFullDate(this.date.getDate(), 2))
		str = str.replace(/hh/g, this.translateFullDate(this.date.getHours(), 2))
		str = str.replace(/HH/g, this.translateFullDate(this.date.getHours(), 2))
		str = str.replace(/mm/g, this.translateFullDate(this.date.getMinutes(), 2))
		str = str.replace(/ss/g, this.translateFullDate(this.date.getSeconds(), 2))
		return str;
	}
	/**
	 * 获取当前年
	 * @return — 根据当地时间，返回一个对应于给定日期的年份数字。
	 */
	getYear(): number {
		return this.date.getFullYear()
	}
	/**
	 * 获取当前月
	 * @description 是从0开始，1-11月
	 * @return — 一个 0 到 11 的整数值：0 代表一月份，1 代表二月份，2 代表三月份，依次类推
	 */
	getMonth(): number {
		
		return this.date.getMonth()
	}
	/**
	 * 获取当前天
	 * @return — 返回一个 1 到 31 的整数值。
	 */
	getDate(): number {
		return this.date.getDate()
	}
	/**
	 * 获取当前小时
	 * @return — 返回一个 0 到 23 之间的整数值。
	 */
	getHours(): number {
		return this.date.getHours()
	}
	/**
	 * 获取当前分钟
	 * @return — 返回一个 0 到 59 的整数值。
	 */
	getMinutes(): number {
		return this.date.getMinutes()
	}
	/**
	 * 获取当前秒
	 * @return — 返回一个 0 到 59 的整数值。
	 */
	getSeconds(): number {
		return this.date.getSeconds()
	}
	/**
	 * 获取指定是数据
	 * @param {tmDateTypeTime} d - 'y' 年 'm' 月 'd' 日 'h' 时 'M' 分 's' 秒 'ms' 毫秒
	 * @returns - 指定类型的数值
	 */
	getDateOf(d: tmDateTypeTime = 'd'): number {
		if (d == 'y') {
			return this.date.getFullYear()
		}
		else if (d == 'm') {
			return this.date.getMonth()
		}
		else if (d == 'd') {
			return this.date.getDate()
		}
		else if (d == 'h') {
			return this.date.getHours()
		}
		else if (d == 'M') {
			return this.date.getMinutes()
		}
		else if (d == 's') {
			return this.date.getSeconds()
		}
		return this.date.getMilliseconds()
	}
	/**
	 * 设定日期
	 * @param {number} n - 设定的数据,
	 * @param {string} d - 比如d=y，那么就是设置本日期的年份数据,'y' 年 'm' 月 'd' 日 'h' 时 'M' 分 's' 秒 'ms' 毫秒
	 * @returns - xDate对象实例
	 */
	setDateOf(n: number, d: tmDateTypeTime = 'd'): tmDate {
		if (d == 'y') {
			this.date.setFullYear(n)
		}
		else if (d == 'm') {
			this.date.setMonth(n)
		}
		else if (d == 'd') {
			this.date.setDate(n)
		}
		else if (d == 'h') {
			this.date.setHours(n)
		}
		else if (d == 'M') {
			this.date.setMinutes(n)
		}
		else if (d == 's') {
			this.date.setSeconds(n)
		}
		else if (d == 'ms') {
			this.date.setMilliseconds(n)
		}
		return this;
	}

	/**
	 * @param {string} - d:'y' 年 'm' 月 'd' 日 'h' 时 'M' 分 's' 秒 'ms' 毫秒
	 * @returns - 返回从UTC时间1970年1月1日午夜开始以毫秒为单位存储的时间值。
	 * @description 注意，如果不提供d就默认返回毫秒，比如设置d=m那么后面的h,M,s,ms会被设置为0
	 */
	getTime(d: tmDateTypeTime): number {
		let date = new Date(this.date.getTime())

		if (d == 'y') {
			date.setMonth(0)
			date.setDate(1)
			date.setHours(0)
			date.setMinutes(0)
			date.setSeconds(0)
			date.setMilliseconds(0)
			return date.getTime()
		}
		else if (d == 'm') {
			date.setDate(1)
			date.setHours(0)
			date.setMinutes(0)
			date.setSeconds(0)
			date.setMilliseconds(0)
			return date.getTime()
		}
		else if (d == 'd') {
			date.setHours(0)
			date.setMinutes(0)
			date.setSeconds(0)
			date.setMilliseconds(0)
			return date.getTime()
		}
		else if (d == 'h') {
			date.setMinutes(0)
			date.setSeconds(0)
			date.setMilliseconds(0)
			return date.getTime()
		}
		else if (d == 'M') {
			date.setSeconds(0)
			date.setMilliseconds(0)
			return date.getTime()
		}
		else if (d == 's') {
			date.setMilliseconds(0)
			return date.getTime()
		}
		return date.getTime()
	}

	/**
	 * 当前时间的副本
	 */
	getClone(): tmDate {
		let p = this.format("YYYY/MM/DD HH:mm:ss");
		return new tmDate(p);
	}
	/**
	 * 本年的第几周
	 * @return 周次
	 */
	getWeek(): number {
		var target = createDate(this.format());
		target.setDate(target.getDate() - (target.getDay() == 0 ? 7 : target.getDay()));
		var firstDayOfYear = new Date(target.getFullYear(), 0, 1);
		firstDayOfYear.setDate(firstDayOfYear.getDate() - (firstDayOfYear.getDay() == 0 ? 7 : firstDayOfYear.getDay()));
		return Math.ceil((((target.getTime() - firstDayOfYear.getTime()) / 86400000) + 1) / 7);
	}
	/**
	 * 取时间的第一天
	 * @param {m,w,y} - m表示取本月的第一天，w取本周的第一天,y表示本年的第一天
	 * @returns {tmDate} - 返回xDate对象
	 */
	getDateStartOf(d: 'm' | 'w' | 'y' = 'm'): tmDate {
		// 获取当前日期对象
		var now = createDate(this.format());
		if (d == 'w') {
			// 将日期设置为所在周的周一（遵循ISO 8601标准，周一开始于周一）
			var dayOfWeek = now.getDay();
			if (dayOfWeek === 0) { // 如果是星期日，则向前推一天至上周的周一
				now.setDate(now.getDate() - 7);
			}
			now.setDate(now.getDate() - dayOfWeek + 1);
		}
		if (d == 'm' || d == 'y') {
			now.setDate(1);
		}
		if (d == 'y') {
			now.setMonth(0);
		}
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		return dateCovertTmDate(now);
	}

	/**
	 * 取时间的最后一天
	 * @param {string} - m,w,y m表示取本月的最后一天，w取本周的最后一天,y表示本年的最后一天
	 * @returns {tmDate} - 返回xDate对象
	 */
	getDateEndOf(d: 'm' | 'w' | 'y' = 'm') {
		// 获取当前日期对象
		var now = createDate(this.format());
		if (d == 'w') {
			// 将日期设置为所在周的周一（遵循ISO 8601标准，周一开始于周一）
			var dayOfWeek = now.getDay();
			if (dayOfWeek === 0) { // 如果是星期日，则向前推一天至上周的周一
				return dateCovertTmDate(now);
			}
			now.setDate(now.getDate() + (7 - dayOfWeek));
		}
		if (d == 'm' || d == 'y') {
			now.setDate(this.getMonthCountDay());
		}
		if (d == 'y') {
			now.setMonth(11);
		}
		now.setHours(23);
		now.setMinutes(59);
		now.setSeconds(59);
		return dateCovertTmDate(now);
	}


	/**
	 * 根据本地时间，返回一个具体日期中一周的第几天，0 表示星期天。 
	 * @return — 根据本地时间，返回一个 0 到 6 之间的整数值，代表星期几：0 代表星期日，1 代表星期一，2 代表星期二，依次类推。
	 */
	getWeekDay(): number {
		return this.date.getDay()
	}
	/**
	 * 根据本地时间，返回一个具体日期中一周的第几天，0 表示星期天。 
	 * @param {string[]} model 具有星期的中文模板，请按照顺序放置如["周日","周一","周二","周三","周四","周五","周六"]
	 * @return — 返回一个具中中国的星期的大写
	 */
	getWeekDayCn(model: string[] | null = null): string {
		let ml = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
		if (model != null && model?.length == 7) {
			ml = model!;
		}
		return ml[this.getWeekDay()]!
	}
	/**
	 * 返回当前日期本月的最大天数
	 * @returns - 当前月份的最大天数
	 */
	getMonthCountDay(): number {
		let nextDate = createDate(this.format());

		// 先设置为1号，避免后面设置月份时超过月的天数。
		nextDate.setDate(1)
		nextDate.setMonth(this.getMonth() + 1)
		// 设置为上月的最后一天。
		nextDate.setDate(0)
		return nextDate.getDate()
	}

	/**
	 * 返回当日的信息
	 * @returns - 返回一个包含年月日周次，星期，农历等的对象
	 */
	getDateInfo(str: string | null = null): TM.tmDateDayInfoType {
		let date = this as tmDate
		if (str != null) {
			date = new tmDate(str)
		}
		let info = {
			year: date.getYear(),
			month: date.getMonth(),
			day: date.getDate(),
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds(),
			week: date.getWeekDay(),
			weeks: date.getWeek(),
			weekCn: date.getWeekDayCn(),
			date: ""
		} as TM.tmDateDayInfoType
		info.date = info.year + '/' + (info.month + 1) + '/' + info.day
		return info
	}

	/**
	 * 返回日期数组
	 * @param {string}  - m,w,m表示返回本月的日期数据，w表示返回本周的日期数据
	 * @returns - 返回一个日期数组
	 */
	getDaysOf(d: 'm' | 'w' = 'm'): TM.tmDateDayInfoType[] {
		let dates = [] as TM.tmDateDayInfoType[]
		if (d == 'w') {
			let first = this.getDateStartOf('w')

			for (let i = 0; i < 7; i++) {
				let date = first.getClone()
				date.date.setDate(date.date.getDate() + i)
				dates.push(date.getDateInfo())
			}
		}
		if (d == 'm') {
			let first = this.getDateStartOf('m')
			let maxDay = this.getMonthCountDay()
			for (let i = 1; i <= maxDay; i++) {
				let date = first.getClone()
				date.date.setDate(i)
				dates.push(date.getDateInfo())
			}

		}

		return dates;
	}

	/**
	 * 为当前日期进行加操作
	 * @param {string}  - y,m,d,h,M,s,w，代表的是年份，月份，日期，小时，分钟，秒数,周
	 */
	add(count: number, d: tmDateTypeTime = 'd') {
		if (d == 'y') {
			this.date.setFullYear(this.getYear() + count)
		}
		else if (d == 'm') {
			this.date.setMonth(this.getMonth() + count)
		}
		else if (d == 'd') {
			this.date.setDate(this.getDate() + count)
		}
		else if (d == 'h') {
			this.date.setHours(this.getHours() + count)
		}
		else if (d == 'M') {
			this.date.setMinutes(this.getMinutes() + count)
		}
		else if (d == 's') {
			this.date.setSeconds(this.getSeconds() + count)
		}
		// 添加一周
		else if (d == 'w') {
			this.date.setDate(this.getDate() + count * 7)

		}

		return this;
	}
	/**
	 * 为当前日期进行减操作
	 * @param {string}  - y,m,d,h,M,s,w，代表的是年份，月份，日期，小时，分钟，秒数,周
	 */
	subtraction(count: number, d: tmDateTypeTime = 'd') {
		if (d == 'y') {
			this.date.setFullYear(this.getYear() - count)
		}
		else if (d == 'm') {
			this.date.setMonth(this.getMonth() - count)
		}
		else if (d == 'd') {
			this.date.setDate(this.getDate() - count)
		}
		else if (d == 'h') {
			this.date.setHours(this.getHours() - count)
		}
		else if (d == 'M') {
			this.date.setMinutes(this.getMinutes() - count)
		}
		else if (d == 's') {
			this.date.setSeconds(this.getSeconds() - count)
		}
		// 添加一周
		else if (d == 'w') {
			this.date.setDate(this.getDate() - count * 7)
		}

		return this;
	}


	/**
	 * 日期是否在一个区间内
	 * @param {tmDate} start 开始日期
	 * @param {tmDate} end 结束日期
	 * @param {string} - type要比较的单位，默认为ms,'y' 年 'm' 月 'd' 日 'h' 时 'M' 分 's' 秒 'ms' 毫秒
	 * @param {string} - d,默认为[] 区间类型，'()'不含起始'[]'包含起始'(]'不包含开始，但包含结束'[)'包含开始，但不包含结束
	 * @returns {boolean} 是否在区间内
	 */
	isBetween(start: tmDate, end: tmDate, type: tmDateTypeTime = 'ms', d: '()' | '[]' | '(]' | '[)' = '[]'): boolean {
		let startTime = start.getTime(type)

		// new Date('1970-1-1 8:0:0').getTime()
		let endTime = end.getTime(type)
		let nowTime = this.getTime(type)
		if (d == '()') {
			return nowTime > startTime && nowTime < endTime
		}
		else if (d == '[]') {
			return nowTime >= startTime && nowTime <= endTime
		}
		else if (d == '(]') {
			return nowTime > startTime && nowTime <= endTime
		}
		else if (d == '[)') {
			return nowTime >= startTime && nowTime < endTime
		}
		return nowTime >= startTime && nowTime <= endTime
	}

	/**
	 * 与目标日期比较
	 * @param {tmDate} targetDate 要比较的日期
	 * @param {string} - d,默认为> 比较类型，'>'大于目标日期，'>='大于等于目标'<'小于目标，'<='小于等于目标,'='全等
	 * @param {string} - type要比较的单位，默认为ms,'y' 年 'm' 月 'd' 日 'h' 时 'M' 分 's' 秒 'ms' 毫秒
	 * @returns {boolean} 比较结果
	 */
	isBetweenOf(targetDate: tmDate, d: '>' | '>=' | '<' | '<=' | '=' = '>', type: tmDateTypeTime = 'ms'): boolean {
		let startTime = targetDate.getTime(type)
		let nowTime = this.getTime(type)
		if (d == '>') {
			return nowTime > startTime
		}
		else if (d == '>=') {
			return nowTime >= startTime
		}
		else if (d == '<') {
			return nowTime < startTime
		}
		else if (d == '<=') {
			return nowTime <= startTime
		}
		else if (d == '=') {
			return nowTime == startTime
		}
		return nowTime > startTime
	}
	/**
	 * 与目标时间过了多久
	 * @param {string|tmDate|null} target 要对比的相对时间，如果填写null就表示当前时间以来的的多久
	 * @param {Map<number,string>} model 如果为null或者为空的map采用默认值,map格式key表示以秒为单位的时间，value为对应的文本
	 * 比如60,1分钟前
	 * @param {string} format 超过最大值最使用格式化日期，如果为null默认为YYYY-MM-DD
	 * @returns {string} 返回对应的时间文本
	 */
	fromBetweenLongTime(target: any, model: Map<number, string> | null, format: string | null): string {
		let bijiaodate: tmDate = new tmDate()
		if (target instanceof tmDate) {
			bijiaodate = (target as tmDate)
		} else if (typeof target == 'string') {
			bijiaodate = new tmDate(target as string)
		} else if (target == null) {
			bijiaodate = new tmDate()
		}

		let mapmodel = new Map<number, string>([
			[30, '刚刚'],
			[60, '1分前'],
			[60 * 5, '5分前'],
			[60 * 10, '10分前'],
			[60 * 30, '半小时前'],
			[60 * 60, '1小时前'],
			[60 * 60 * 2, '2小时前'],
			[60 * 60 * 3, '3小时前'],
			[60 * 60 * 5, '5小时前'],
			[60 * 60 * 23, '今天'],
			[60 * 60 * 24 * 1, '1天前'],
			[60 * 60 * 24 * 2, '2天前'],
			[60 * 60 * 24 * 7, '1周前'],
			[60 * 60 * 24 * 30, '1个月前'],
			[60 * 60 * 24 * 30 * 2, '2个月前'],
			[60 * 60 * 24 * 30 * 3, '3个月前'],
			[60 * 60 * 24 * 30 * 4, '4个月前'],
			[60 * 60 * 24 * 30 * 5, '5个月前'],
			[60 * 60 * 24 * 30 * 6, '半年前'],
			[60 * 60 * 24 * 30 * 12, '1年前'],
			[60 * 60 * 24 * 30 * 12 + 60 * 60 * 24 * 30, '']
		])
		let fmt = format == null ? 'YYYY-MM-DD' : (format!)

		if (model != null) {
			if (model!.size > 0) {
				mapmodel = model!
			}
		}
		let str = ""
		let fanzhumap = [] as number[];
		mapmodel.forEach((value: string, key: number) => {
			fanzhumap.push(key)
		})
		fanzhumap.reverse()

		try {
			let startTime = bijiaodate.getTime('s')
			let nowTime = this.getTime('s')
			let diff = (nowTime - startTime) / 1000

			if (diff > 0) {
				for (let i = 0; i < fanzhumap.length; i++) {
					let key = fanzhumap[i];

					if (diff >= key) {

						str = mapmodel.get(key)!
						break;
					}
				}

			} else {
				str = mapmodel.get(fanzhumap[fanzhumap.length - 1])!
			}
			if (str == '') {
				str = bijiaodate.format(fmt)
			}


		} catch (e) {
			//TODO handle the exception
		}



		return str
	}
	/**
	 * 与目标时间相差多少个单位
	 * @param {string|tmDate|null} target 目标时间
	 * @param {tmDateTypeTime} type 相差的单位，默认：s秒
	 * @returns {string} 反返回以xDateTypeTime为单位相关的时间数
	 */
	diffTime(target: any, type: tmDateTypeTime = 's'): number {
		let startTime = 0
		let typed: tmDateTypeTime = (type == 'w' ? 'd' : type)
		if (target instanceof tmDate) {
			startTime = (target as tmDate).getTime(typed)
		} else if (typeof target == 'string') {
			startTime = new tmDate(target as string).getTime(typed)

		} else if (target == null) {
			startTime = new tmDate().getTime(typed)
		}

		let nowTime = this.getTime(typed)
		let diff = Math.abs(nowTime - startTime);
		let d = 0
		if (type == 's') {
			d = diff
		} else if (type == 'M') {
			d = diff / 60 / 1000
		} else if (type == 'h') {
			d = diff / 60 / 60 / 1000
		} else if (type == 'd') {
			d = diff / 60 / 60 / 24 / 1000
		} else if (type == 'm') {
			d = diff / 60 / 60 / 24 / 30 / 1000
		} else if (type == 'y') {
			d = diff / 60 / 60 / 24 / 30 / 12 / 1000
		} else if (type == 'w') {
			let ondate = (1000 * 60 * 60 * 24 * 7);
			d = diff / ondate
		}

		return Math.floor(d)
	}
	/**
	 * 获取季度
	 * @param {string} type y表示获取本年的4个季度，空值表示获取当前时间所在的季度
	 * @returns {tmDateTypeQuarter[]} 返回一个季度数组{quarter:number,start:string,end:string}
	 */
	getQuarter(type: string = ''): tmDateTypeQuarter[] {
		let q1 = [1, 2, 3]
		let q2 = [4, 5, 6]
		let q3 = [7, 8, 9]
		let q4 = [10, 11, 12]
		let nowMonth = this.getMonth() + 1
		let qall = [q1, q2, q3, q4] as number[][]
		let qmap = [] as tmDateTypeQuarter[]
		if (type == 'y') {
			for (let i = 0; i < qall.length; i++) {
				let item = qall[i]
				let sdate = new tmDate(this.getYear() + '/' + item[0] + '/1')
				let edate = new tmDate(this.getYear() + '/' + item[item.length - 1] + '/1')
				let start = sdate.format('YYYY/MM/DD')
				let end = edate.getDateEndOf('m').format('YYYY/MM/DD')
				qmap.push({
					quarter: i,
					start,
					end
				} as tmDateTypeQuarter)
			}
		} else {
			for (let i = 0; i < qall.length; i++) {
				let item = qall[i]
				if (item.includes(nowMonth)) {
					let sdate = new tmDate(this.getYear() + '/' + item[0] + '/1')
					let edate = new tmDate(this.getYear() + '/' + item[item.length - 1] + '/1')
					let start = sdate.format('YYYY/MM/DD')
					let end = edate.getDateEndOf('m').format('YYYY/MM/DD')
					qmap.push({
						quarter: i,
						start,
						end
					} as tmDateTypeQuarter)
					break;
				}
			}
		}
		return qmap;
	}

}

/**
 * 将一个日期转换为tmDate对象
 */
export const dateCovertTmDate = function (date: Date){
	let str = date.getFullYear().toString() + "/" + (date.getMonth() + 1).toString() + "/"
		+ date.getDate().toString() + " " + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString()
	return new tmDate(str)
}