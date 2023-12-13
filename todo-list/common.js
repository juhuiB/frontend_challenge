document.addEventListener("DOMContentLoaded", function () {
    // 할일 추가
    document.querySelector(".btn-add").addEventListener("click", function () {
        var todoText = document.querySelector(".input").value.trim();
        
        if (todoText !== "") {
            // 뱃지 타입 가져오기
            var selectedBadge = document.querySelector(".badge-list .badge.active");
            var badgeType = selectedBadge ? selectedBadge.classList[1] : ""; //뱃지 클래스 가져오기
            var badgeText = selectedBadge ? selectedBadge.querySelector("a").innerText : ""; //뱃지 텍스트 가져오기
            
            if (todoText !== "" && badgeType !== "") { 
                // todo 아이템 만들기
                var todoItem = document.createElement("div");
                todoItem.classList.add("line-area");

                var todoContent = document.createElement("div");
                todoContent.classList.add("todo");

                var checkBox = document.createElement("div");
                checkBox.classList.add("check-box");
                checkBox.innerHTML = '<input type="checkbox" class="check">';

                var todoTextElement = document.createElement("p");
                todoTextElement.innerText = todoText;

                todoContent.appendChild(checkBox);
                todoContent.appendChild(todoTextElement);

                // todo 아이템에 뱃지 추가하기
                if (badgeType !== "") {
                    var badgeElement = document.createElement("span");
                    badgeElement.classList.add("badge", badgeType);
                    badgeElement.innerText = badgeText;  // 뱃지 텍스트 추가
                    todoItem.appendChild(badgeElement);
                }
                    
                // 수정버튼 만들기
                var editButton = document.createElement("button");
                editButton.classList.add("btn-edit");
                editButton.innerText = "수정";

                todoItem.appendChild(todoContent);
                todoItem.appendChild(badgeElement);
                todoItem.appendChild(editButton);

                document.querySelector(".content .todo-box").appendChild(todoItem);
                document.querySelector(".input").value = ""; // 리스트 추가 후 입력 필드 초기화
                
                // 리스트 추가 후 선택된 뱃지 스타일 초기화
                if (selectedBadge) {
                    selectedBadge.classList.remove("active");
                }
                
            } else {
                 // 뱃지가 선택되지 않은 경우 알림 표시
                alert("뱃지를 선택해 주세요.");
            }
            
        }
    });

    // 뱃지 선택 + active toggle
    var badgeLinks = document.querySelectorAll(".badge-list .badge a");
    badgeLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelectorAll(".badge-list .badge").forEach(function (badge) {
                badge.classList.remove("active");
            });
            link.parentElement.classList.add("active");
        });
    });

    // 완료/미완료 탭 선택
    var tabLinks = document.querySelectorAll(".tab-header ul li a");
    tabLinks.forEach(function (tabLink) {
        tabLink.addEventListener("click", function (e) {
            e.preventDefault();
            // 탭 on 클래스 토글
            tabLinks.forEach(function (link) {
                link.parentElement.classList.remove("on");
            });
            tabLink.parentElement.classList.add("on");

            var filterType = tabLink.innerText;
            var lineAreas = document.querySelectorAll(".line-area");
            lineAreas.forEach(function (area) {
                var checkBox = area.querySelector(".check");
                if (filterType === "전체" ||
                    (filterType === "완료" && checkBox.checked) ||
                    (filterType === "미완료" && !checkBox.checked)) {
                    area.style.display = "flex";
                } else {
                    area.style.display = "none";
                }
            });
        });
    });

    // 체크박스 체크시 완료 클래스(상태 확인) 추가
    document.querySelector(".content").addEventListener("change", function (event) {
        if (event.target.classList.contains("check")) {
            var lineArea = event.target.closest(".line-area");
            if (event.target.checked) {
                lineArea.classList.add("completed");
            } else {
                lineArea.classList.remove("completed");
            }
        }
    });
    
    // 수정 버튼 클릭 시 수정 모드 활성화
    document.querySelector(".content .todo-box").addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-edit")) {
            var todoItem = event.target.closest(".line-area");
            var todoTextElement = todoItem.querySelector(".todo p");
            var badgeElement = todoItem.querySelector(".badge");
            var editButton = todoItem.querySelector(".btn-edit");

            // 현재 텍스트와 뱃지 정보 저장
            var currentText = todoTextElement.innerText;
            var currentBadge = badgeElement ? badgeElement.innerText : "";

            // 입력 필드와 선택된 뱃지 초기화
            var inputField = document.createElement("input");
            inputField.type = "text";
            inputField.value = currentText;

            var badgeLinks = document.querySelectorAll(".badge-list .badge a");
            badgeLinks.forEach(function (link) {
                link.parentElement.classList.remove("active");
            });

            // 선택된 뱃지 활성화
            var selectedBadge = document.querySelector(".badge-list .badge." + currentBadge);
            if (selectedBadge) {
                selectedBadge.classList.add("active");
            }

            // 입력 필드로 교체
            if (todoTextElement.parentNode) {
                todoTextElement.parentNode.replaceChild(inputField, todoTextElement);
            }

            // 수정 버튼을 확인 버튼으로 변경
            editButton.innerText = "확인";
            editButton.classList.add("btn-confirm");
            editButton.classList.remove("btn-edit");

            // 확인 버튼 클릭 시 수정 내용 반영
            editButton.addEventListener("click", function handleConfirm() {
                var newText = inputField.value.trim();
                var newBadgeElement = document.querySelector(".badge-list .badge.active a");
                var newBadgeText = newBadgeElement ? newBadgeElement.innerText : "";
                var newBadgeClass = newBadgeElement ? newBadgeElement.parentElement.classList[1] : "";

                // 변경된 내용을 반영
                if (inputField.parentNode) {
                    inputField.parentNode.replaceChild(todoTextElement, inputField);
                    todoTextElement.innerText = newText;
                }

                if (badgeElement) {
                    // 이미 존재하는 뱃지 엘리먼트 수정
                    badgeElement.innerText = newBadgeText;
                    badgeElement.className = "badge " + newBadgeClass; // 클래스 업데이트
                } else if (newBadgeText && newBadgeClass) {
                    // 새로운 뱃지 엘리먼트 추가
                    badgeElement = document.createElement("span");
                    badgeElement.classList.add("badge", newBadgeClass);
                    badgeElement.innerText = newBadgeText;
                    todoItem.insertBefore(badgeElement, editButton);
                }

                // 수정 모드 비활성화
                editButton.innerText = "수정";
                editButton.classList.remove("btn-confirm");
                editButton.classList.add("btn-edit");

                // 이벤트 리스너 제거
                editButton.removeEventListener("click", handleConfirm);
            });
        }
    });
    
    
    
    
    
    
    
    
});
