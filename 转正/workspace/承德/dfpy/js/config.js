var DEBUG = 0;	//0 本地数据 1 接口数据
var Api = {
	getQuestionList:["data/getQuestionList.js","http://localhost:8080/votesManager/getQuestionnaires.action?areaid={0}"][DEBUG],	//获取区域下的问卷信息
	getQuestionContent:["data/getQuestionContent.js","http://localhost:8080/votesManager/getAllQuestionsAndOptions.action?questionnaireId={0}"][DEBUG],	//获取问卷下所有过审的题目及其选项
	submitRes:["data/submitRes.js","http://localhost:8080/votesManager/addVote.action?caId={0}&questionnaireId={1}&questionId={2}&optionId={3}&operatorKey={4}&tel="][DEBUG]		//提交问卷选择
};