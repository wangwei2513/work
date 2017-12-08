var DEBUG = 1;	//0 本地数据 1 接口数据
var Api = {
	getQuestionList:["data/getQuestionList.js","http://192.168.129.161:8080/votesManager_chengde/getQuestionnaires.action?areaid=0"][DEBUG],	//获取区域下的问卷信息
	getQuestionContent:["data/getQuestionContent.js","http://192.168.129.161:8080/votesManager_chengde/getAllQuestionsAndOptions.action?questionnaireId={0}"][DEBUG],	//获取问卷下所有过审的题目及其选项
	submitRes:["data/submitRes.js","http://192.168.129.161:8080/votesManager_chengde/addVote.action?caId={0}&questionnaireId={1}&questionId={2}&optionId={3}&operatorKey={4}&tel="][DEBUG]		//提交问卷选择
};
